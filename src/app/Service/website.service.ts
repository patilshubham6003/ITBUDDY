import { Injectable } from '@angular/core';
import { appkeys } from '../app.constant';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Stat } from '../Modal/stat';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  Baseurl = appkeys.baseUrl;
  retriveimgUrl = appkeys.retriveimgUrl;
  url = appkeys.url;
  clientId = 1;
  baseUrl = appkeys.baseUrl;
  imgUrl = appkeys.imgUrl1;

  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  //   loggerUrl = appkeys.gmUrl
  // gmUrl = appkeys.gmUrl

  fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  // Local
  // application = TQ7JZ1FDsSA1qHED
  // api = Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK

  constructor(public httpClient: HttpClient, public cookie: CookieService) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = this.randomstring(16);
      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '/',
        '',
        true,
        'None'
      );
    }
    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      token: this.cookie.get('token'),
      sessionkey: this.cookie.get('sessionKey'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  //Local
  randomstring(L: any) {
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

  generateRandomNumber(n: any) {
    return (
      Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) +
      Math.pow(10, n - 1)
    );
  }

  // loggerInit() {
  // 	this.httpHeaders1 = new HttpHeaders({
  // 		'Content-Type': 'application/json',
  // 		'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
  // 		'applicationkey': '1fR4UanlaUrylXe5',
  // 		'deviceid': this.cookie.get('deviceId'),
  // 	});
  // 	this.options1 = {
  // 		headers: this.httpHeaders1
  // 	};
  // 	var data = {
  // 		CLIENT_ID: this.clientId
  // 	};
  // 	return this.httpClient.post(this.gmUrl + "device/init", JSON.stringify(data), this.options1);
  // }

  memberRegister(data: any): Observable<any> {
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
      this.baseUrl + 'web/employeeRegistration/registerEmployee',
      JSON.stringify(data),
      this.options
    );
  }
  getcity(
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
      this.baseUrl + 'web/city/get',
      JSON.stringify(data),
      this.options
    );
  }

  memberLogin(MOBILE_NO: any): Observable<any> {
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
      this.baseUrl + 'employee/sendEmployeeRegistrationOtp',
      JSON.stringify({ MOBILE_NO: MOBILE_NO }),
      this.options
    );
  }

  emailotpsend(EMAIL_ID: any, EMPLOYEE_CODE: any): Observable<any> {
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
      this.baseUrl + 'web/employee/sendEmailOtp',
      JSON.stringify({ EMAIL_ID: EMAIL_ID, EMPLOYEE_CODE: EMPLOYEE_CODE }),
      this.options
    );
  }

  LoginUser(username: any, password: any): Observable<any> {
    var data = {
      username: username,
      password: password,
      CLOUD_ID: this.cookie.get('CLOUD_ID'),
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
      this.baseUrl + 'user/login',
      JSON.stringify(data),
      this.options
    );
  }
  checkmailid(username: any): Observable<any> {
    var data = {
      username: username,
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
      this.baseUrl + 'user/check',
      JSON.stringify(data),
      this.options
    );
  }
  verifyOTP(MOBILE_NO: any, VERIFY_OTP: any): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      OTP: VERIFY_OTP,
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
      this.baseUrl + 'employee/verifyOtp',
      JSON.stringify(data),
      this.options
    );
  }

  verifyOTP1(EMAIL_ID: any, VERIFY_OTP: any): Observable<any> {
    var data = {
      EMAIL_ID: EMAIL_ID,
      VERIFY_OTP: VERIFY_OTP,
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
      this.baseUrl + 'web/employee/verifyEmailOtp',
      JSON.stringify(data),
      this.options
    );
  }

  sendOtpToDevice(MOBILE_NO: any): Observable<any> {
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
      this.baseUrl + 'sendRegistrationOtp',
      JSON.stringify({
        MOBILE_NO: MOBILE_NO,
      }),
      this.options
    );
  }

  websiteForgetPassword(MOBILE_NO: any, EMPLOYEE_CODE: any): Observable<any> {
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
      this.baseUrl + 'employee/sendEmployeeForgotOtp',
      JSON.stringify({
        MOBILE_NO: MOBILE_NO,
        EMPLOYEE_CODE: EMPLOYEE_CODE,
      }),
      this.options
    );
  }

  verifyOTP3(MOBILE_NO: any, OTP: any): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      OTP: OTP,
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
      this.baseUrl + 'employee/verifyOtp',
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
      this.baseUrl + 'employee/changePassword',
      JSON.stringify({
        MOBILE_NO: MOBILE_NO,
        NEW_PASSWORD: NEW_PASSWORD,
      }),
      this.options
    );
  }

  getAllwebsiteBanner(
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
      this.baseUrl + 'web/websiteBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  getservices(
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
      this.baseUrl + 'web/service/get',
      JSON.stringify(data),
      this.options
    );
  }

  getabout(
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
      this.baseUrl + 'web/about/get',
      JSON.stringify(data),
      this.options
    );
  }

  getcount(
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
      this.baseUrl + 'web/webDashboardStats/get',
      JSON.stringify(data),
      this.options
    );
  }

  getnews(
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
      this.baseUrl + 'web/news/get',
      JSON.stringify(data),
      this.options
    );
  }

  createcontact(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
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
      this.baseUrl + 'web/userContact/create',
      JSON.stringify(role),
      this.options
    );
  }

  getAllcontact(
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
      this.baseUrl + 'web/contactInfo/get',
      JSON.stringify(data),
      this.options
    );
  }

  getdownloads(
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
      this.baseUrl + 'web/download/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllGalleryWeb(
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
      this.baseUrl + 'web/gallary/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllGallerycategoryWeb(
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
      this.baseUrl + 'web/gallaryCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllVideoWeb(
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
      this.baseUrl + 'web/video/get',
      JSON.stringify(data),
      this.options
    );
  }

  getcontactdirectory(
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
      this.baseUrl + 'web/contactDirectory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getservicestats(SERVICE_ID: any): Observable<any> {
    var data = {
      SERVICE_ID: SERVICE_ID,
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
      this.baseUrl + 'web/webDashboardStatsServiceWise/get',
      JSON.stringify(data),
      this.options
    );
  }

  getbenefits(
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
      this.baseUrl + 'web/benefit/get',
      JSON.stringify(data),
      this.options
    );
  }

  getfeatures(
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
      this.baseUrl + 'web/feature/get',
      JSON.stringify(data),
      this.options
    );
  }

  getoffices(
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
      this.baseUrl + 'web/office/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateprofile(data: any) {
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
      this.baseUrl + 'api/employee/update',
      JSON.stringify(data),
      this.options
    );
  }

  getprofiledata(
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
      this.baseUrl + 'api/employee/get',
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
      this.baseUrl + 'api/family/get',
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
      this.baseUrl + 'api/family/update',
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
      this.baseUrl + 'api/family/create',
      JSON.stringify(data),
      this.options
    );
  }

  getfaqheads(
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
      this.baseUrl + 'web/faqHead/get',
      JSON.stringify(data),
      this.options
    );
  }

  getfaq(
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
      this.baseUrl + 'web/faq/get',
      JSON.stringify(data),
      this.options
    );
  }

  sendresponse(data: any) {
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
      this.baseUrl + 'web/faq/markHelpfulCount',
      JSON.stringify(data),
      this.options
    );
  }

  //   onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
  // 	this.httpHeaders1 = new HttpHeaders({
  // 	  accept: 'application/json',
  // 	  apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  // 	  applicationkey: 'TQ7JZ1FDsSA1qHED',
  // 	  deviceid: this.cookie.get('deviceId'),
  // 	  supportkey: this.cookie.get('supportKey'),
  // 	  Token: this.cookie.get('token'),
  // 	});
  // 	this.options1 = {
  // 	  headers: this.httpHeaders1,
  // 	};
  // 	const fd = new FormData();
  // 	fd.append('Image', selectedFile, filename);
  // 	return this.httpClient.post<any>(appkeys.imgUrl + folderName, fd, this.options1);
  //   }

  getcount1(
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
      this.baseUrl + 'web/stat/get',
      JSON.stringify(data),
      this.options
    );
  }

  onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      accept: 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    return this.httpClient.post<any>(
      appkeys.imgUrl + folderName,
      fd,
      this.options1
    );
  }
  getallgenralreq(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/ithrEmployeeGeneralRequest/get',
      JSON.stringify(data),
      this.options
    );
  }
  onUploadidproof(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      accept: 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    return this.httpClient.post<any>(
      appkeys.imgUrl + folderName,
      fd,
      this.options1
    );
  }

  //CHANGE PASSWORD USER
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
  //CHANGE PASSWORD USER

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

  getDesignation(
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
      this.baseUrl + 'web/designation/get',
      JSON.stringify(data),
      this.options
    );
  }
  getgradepaylevel(
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
      this.baseUrl + 'web/graasGradePayLevel/get',
      JSON.stringify(data),
      this.options
    );
  }

  getstatsmastrrrrr(
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
      this.baseUrl + 'web/stat/get',
      JSON.stringify(data),
      this.options
    );
  }

  getgradepay(
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
      this.baseUrl + 'gradePay/get',
      JSON.stringify(data),
      this.options
    );
  }

  getRegistrationStatuscount() {
    var data = {};
    return this.httpClient.post<Stat[]>(
      this.baseUrl +
        'api/employeeRegistration/getSummaryForEmployeeRegistration',
      JSON.stringify(data),
      this.options
    );
  }

  onUploadidproof1(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      accept: 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
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
      appkeys.imgUrl + folderName,
      fd,
      options1
    );
    return this.httpClient.request(req);
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
  deletealluploads(FILE_URL: any): Observable<any> {
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
      this.baseUrl + 'web/removeFile',
      JSON.stringify(data),
      this.options
    );
  }

  generateMd5Hash(password: string): string {
    return CryptoJS.MD5(password).toString(CryptoJS.enc.Hex);
  }

  getquarterallotmentData(
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
      this.baseUrl + 'allotmentData/get',
      JSON.stringify(data),
      this.options
    );
  }
  updatequarterallotmentData(data: any) {
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
      this.baseUrl + 'allotmentData/update',
      JSON.stringify(data),
      this.options
    );
  }
  CreatequarterallotmentData(data: any) {
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
      this.baseUrl + 'allotmentData/create',
      JSON.stringify(data),
      this.options
    );
  }

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
  getResidenceforuser(
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

  onUpload2(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      APIKEY: 'ldRWbKGy5P0sQx17jAxk6FNiqr1MIUC0',
      // APPLICATION_KEY: '6AWkFcs740gTqcfb',
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

  getempstatus(
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
      this.baseUrl + 'api/employee/getTabs',
      JSON.stringify(data),
      this.options
    );
  }

  getAllAddressDetails(
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
      this.url + 'addressDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  updateAddressDetails(address: any): Observable<any> {
    address.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + 'addressDetails/update',
      JSON.stringify(address),
      this.options
    );
  }
  createAddressDetails(address: any): Observable<any> {
    address.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'addressDetails/create',
      JSON.stringify(address),
      this.options
    );
  }

  getAllServiceDetails(
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
      this.url + 'serviceDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  createServiceDetails(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'serviceDetails/create',
      JSON.stringify(user),
      this.options
    );
  }

  updateServiceDetails(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'serviceDetails/update',
      JSON.stringify(user),
      this.options
    );
  }

  getFamily(
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
      this.url + 'familyDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateFamily(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + 'familyDetails/update',
      JSON.stringify(user),
      this.options
    );
  }

  createFamily(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'familyDetails/createFamilyDetail',
      JSON.stringify(data),
      this.options
    );
  }

  // Other info. optional details
  getEmployeeOtherInfoOptionalDetails(
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
      this.url + 'empOtherDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  createEmployeeOtherInfoOptionalDetails(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'empOtherDetails/createOtherDetail',
      JSON.stringify(form),
      this.options
    );
  }

  updateEmployeeOtherInfoOptionalDetails(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + 'empOtherDetails/update',
      JSON.stringify(form),
      this.options
    );
  }

  getAllEmployeeForTransfer(
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
      this.baseUrl + 'employee/get',
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
      this.baseUrl + 'rank/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllBuildingforTransfer(
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
      this.baseUrl + 'building/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllOfficeForTransfer(
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
      this.baseUrl + 'office/get',
      JSON.stringify(data),
      this.options
    );
  }

  createEmpTransferRequest(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'employeeTransferRequest/createEmpTransferRequest',
      JSON.stringify(data),
      this.options
    );
  }

  getotptotransferform(EMAIL_ID: number, EMP_NO: any): Observable<any> {
    var data = {
      EMAIL_ID: EMAIL_ID,
      EMP_NO: EMP_NO,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'employeeTransferRequest/sendOtp',
      JSON.stringify(data),
      this.options
    );
  }

  confirmOTPForTransfer(MOBILE_NO: number, OTP: number): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      OTP: OTP,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'employeeTransferRequest/verifyOtp',
      JSON.stringify(data),
      this.options
    );
  }
  onUploadAttachments(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      APIKEY: 'ldRWbKGy5P0sQx17jAxk6FNiqr1MIUC0',
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

  getAlltransferRequestnew(
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
      this.url + 'employeeTransferRequest/get',
      JSON.stringify(data),
      this.options
    );
  }

  checkEligiblityTransferRequest(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    EMPLOYEE_CODE
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      EMPLOYEE_CODE: EMPLOYEE_CODE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeTransferRequest/checkEligiblityTransferRequest',
      JSON.stringify(data),
      this.options
    );
  }
  getofficeCategoryData(
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
      this.url + 'officeCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getallPostCategory(
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
      this.url + 'postCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllCityMaster(
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
      this.baseUrl + 'api/city/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllZone(
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
      this.url + 'zone/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllStateMaster(
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
      this.baseUrl + 'api/State/get',
      JSON.stringify(data),
      this.options
    );
  }

  getcategoryData(
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
      this.baseUrl + 'category/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllSubcategoryMasterData(
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
      this.baseUrl + 'subCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getreligionData(
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
      this.baseUrl + 'religion/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllClass(
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
      this.baseUrl + 'api/class/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllPostTypeMaster(
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
      this.url + 'postType/get',
      JSON.stringify(data),
      this.options
    );
  }
  getOfficeStaffDetails(
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
      this.baseUrl + 'api/officeStaffDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateemployeeTransferRequest(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'employeeTransferRequest/updateHA',
      JSON.stringify(form),
      this.options
    );
  }
  updateemployeeTransferRequestBasic(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'employeeTransferRequest/update',
      JSON.stringify(form),
      this.options
    );
  }

  getEducation(
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
      this.url + 'empEducationDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateEducation(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + 'empEducationDetails/update',
      JSON.stringify(user),
      this.options
    );
  }

  createEducation(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'empEducationDetails/createEducationDetail',
      JSON.stringify(data),
      this.options
    );
  }

  getAllQualifications(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'qualifications/get',
      JSON.stringify(data),
      this.options
    );
  }

  createEmployeeExamDetails(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.baseUrl + 'api/empExamDetails/createExamDetail',
      JSON.stringify(form),
      this.options
    );
  }

  updateEmployeeExamDetails(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.baseUrl + 'api/empExamDetails/update',
      JSON.stringify(form),
      this.options
    );
  }

  getAllExam(
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
      this.url + 'exam/get',
      JSON.stringify(data),
      this.options
    );
  }

  getEmployeeExamDetails(
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
      this.baseUrl + 'api/empExamDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  emailotpsendnewprocess(EMAIL_ID: any): Observable<any> {
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
      this.baseUrl + 'employeeRegistration/sendOTP',
      JSON.stringify({ EMAIL_ID: EMAIL_ID }),
      this.options
    );
  }
  verifyemailotpsendnewprocess(EMAIL_ID: any, OTP: any): Observable<any> {
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
      this.baseUrl + 'employeeRegistration/verifyOTP',
      JSON.stringify({ EMAIL_ID: EMAIL_ID, OTP: OTP }),
      this.options
    );
  }
  verifyemailotpsendnewprocessnew(
    EMAIL_ID: any,
    OTP: any,
    EMPLOYEE_CODE: any
  ): Observable<any> {
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
      this.baseUrl + 'web/verifyOtpReg',
      JSON.stringify({
        MOBILE_NO: EMAIL_ID,
        OTP: OTP,
        EMPLOYEE_CODE: EMPLOYEE_CODE,
      }),
      this.options
    );
  }

  empget(dataa: any): Observable<any> {
    var data = {
      EMPLOYEE_CODE: dataa,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'web/getEmployeeCode',
      JSON.stringify(data),
      this.options
    );
  }
  memberRegisternewprocess(data: any): Observable<any> {
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
      this.baseUrl + 'web/employeeRegistration',
      JSON.stringify(data),
      this.options
    );
  }

  getregistrationemployee(
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
      this.baseUrl + 'api/empExamDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  emailotpsendneww(EMAIL_ID: any, EMPLOYEE_CODE: any): Observable<any> {
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
      this.baseUrl + 'web/checkEmail',
      JSON.stringify({ EMAIL_ID: EMAIL_ID, EMPLOYEE_CODE: EMPLOYEE_CODE }),
      this.options
    );
  }
  emailotpsendnewwemail(EMAIL_ID: any, EMPLOYEE_CODE: any): Observable<any> {
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
      this.baseUrl + 'web/checkEmail',
      JSON.stringify({ EMAIL_ID: EMAIL_ID, EMPLOYEE_CODE: EMPLOYEE_CODE }),
      this.options
    );
  }
  emailotpsendnewwmobile(EMAIL_ID: any, EMPLOYEE_CODE: any): Observable<any> {
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
      this.baseUrl + 'web/checkMobile',
      JSON.stringify({ MOBILE_NO: EMAIL_ID, EMPLOYEE_CODE: EMPLOYEE_CODE }),
      this.options
    );
  }

  emailotpsendnewmobilenewapi(MOBILE_NO: any): Observable<any> {
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
      this.baseUrl + 'web/resendCheckMobile',
      JSON.stringify({ MOBILE_NO: MOBILE_NO }),
      this.options
    );
  }

  emailotpsendnewemailnewapi(EMAIL_ID: any): Observable<any> {
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
      this.baseUrl + 'web/resendCheckEmail',
      JSON.stringify({ EMAIL_ID: EMAIL_ID }),
      this.options
    );
  }

  createfeedback(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    var data = {
      ...form,
      // CLIENT_ID: this.clientId,
      //   EMPLOYEE_ID: form.EMPLOYEE_ID,
      //   DESCRIPTION: form.DESCRIPTION,
      //   ATTACHMENT: form.ATTACHMENT,
      //   FEEDBACK_STATUS: form.FEEDBACK_STATUS,
      //   REMARK: form.REMARK,
      //   STATUS: form.STATUS,
      //   TYPE: form.TYPE,
      //   SUBJECT: form.SUBJECT,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/feedback/create',
      JSON.stringify(data),
      this.options
    );
  }

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

  submitipr(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    var data = {
      ...form,
      // CLIENT_ID: this.clientId,
      //   EMPLOYEE_ID: form.EMPLOYEE_ID,
      //   DESCRIPTION: form.DESCRIPTION,
      //   ATTACHMENT: form.ATTACHMENT,
      //   FEEDBACK_STATUS: form.FEEDBACK_STATUS,
      //   REMARK: form.REMARK,
      //   STATUS: form.STATUS,
      //   TYPE: form.TYPE,
      //   SUBJECT: form.SUBJECT,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/iPRForms/create',
      JSON.stringify(data),
      this.options
    );
  }
  submitiprupdate(form: any): Observable<any> {
    var data = {
      ...form,
      // CLIENT_ID: this.clientId,
      //   EMPLOYEE_ID: form.EMPLOYEE_ID,
      //   DESCRIPTION: form.DESCRIPTION,
      //   ATTACHMENT: form.ATTACHMENT,
      //   FEEDBACK_STATUS: form.FEEDBACK_STATUS,
      //   REMARK: form.REMARK,
      //   STATUS: form.STATUS,
      //   TYPE: form.TYPE,
      //   SUBJECT: form.SUBJECT,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/iPRForms/update',
      JSON.stringify(data),
      this.options
    );
  }

  getIPRdata(
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
      this.url + 'iPRForms/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllPostingDetailsMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'postingDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllPromotionDetailsMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'promotionDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  createposstingrequest(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempPostingDetails/create',
      JSON.stringify(data),
      this.options
    );
  }

  creategenrealrequest(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/ithrEmployeeGeneralRequest/create',
      JSON.stringify(data),
      this.options
    );
  }
  updatepostingrequest(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempPostingDetails/update',
      JSON.stringify(data),
      this.options
    );
  }
  getallpostingreq(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempPostingDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  getallpostingreqcount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempPostingDetails/getPostingCount',
      JSON.stringify(data),
      this.options
    );
  }

  submitTP(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    var data = {
      ...form,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/representModuleTP/create',
      JSON.stringify(data),
      this.options
    );
  }

  getalltpreqlist(
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
      this.url + 'representModuleTP/get',
      JSON.stringify(data),
      this.options
    );
  }
}
