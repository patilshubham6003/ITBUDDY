import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IthrtransferService {
  clientId: number = 1;
  cloudID: any;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };

  gmUrl = 'https://gm.tecpool.in:8079/';
  baseUrl = 'https://ithr.uvtechsoft.com:9887/';
  // baseUrl = 'https://d12c-2401-4900-5033-37fa-ecb4-5e6a-7fe8-6cf3.ngrok-free.app/';
  url = this.baseUrl + 'api/';
  imgUrl = this.baseUrl + 'upload/';
  retriveimgUrl = this.baseUrl + 'static/';
  socketUrl = 'http://pms.tecpool.in:3934';
  applicationId = 1;
  dateforlog =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  emailId = sessionStorage.getItem('emailId');
  userId = Number(sessionStorage.getItem('userId'));
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');

  constructor(private cookie: CookieService, private httpClient: HttpClient) {
    this.getheader();
  }

  getheader() {
    // For Local and Testing server
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'ldRWbKGy5P0sQx17jAxk6FNiqr1MIUC0',
      applicationkey: 'Ocalte58RcHq7VIY',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  login(email: string, password: string) {
    this.getheader();

    this.options = {
      headers: this.httpHeaders,
    };

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

  onUpload(folderName, selectedFile, filename): Observable<any> {
    this.onuploadheader();
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

  onuploadheader() {
    // For Local and Testing server
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'w9OAxS4zZXSvub0rVCZf5mt4v6K66pj2',
      applicationkey: 'Y043VCVhq6cbwcvS',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
    });

    this.options1 = {
      headers: this.httpHeaders,
    };
  }

  requestPermission(userId: string) { }

  loggerInit() {
    this.getheader();

    this.options1 = {
      headers: this.httpHeaders1,
    };

    var data = {
      CLIENT_ID: this.clientId,
    };

    return this.httpClient.post(
      this.gmUrl + 'device/init',
      JSON.stringify(data),
      this.options1
    );
  }

  logoutForSessionValues() {
    this.cookie.deleteAll();
    window.location.reload();
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
    this.getheader();
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
    this.getheader();
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

  getotptotransferform(MOBILE_NO: number, EMP_NO: any): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      EMP_NO: EMP_NO
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

  getAlltransferRequestnew(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(this.url + 'employeeTransferRequest/get', JSON.stringify(data), this.options);
  }


  checkEligiblityTransferRequest(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, EMPLOYEE_CODE): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      EMPLOYEE_CODE: EMPLOYEE_CODE
    };
    return this.httpClient.post<any>(this.url + 'employeeTransferRequest/checkEligiblityTransferRequest', JSON.stringify(data), this.options);
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




  createpersonalinformation(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.baseUrl + 'api/employee/createEmployee',
      JSON.stringify(user),
      this.options
    );
  }

  Updatepersonalinformation(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/employee/update',
      JSON.stringify(user),
      this.options
    );
  }

  // purva madam
  getAllDesignation(pageIndex: number, pageSize: number, sortKey: string, sortValue: string,
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
      this.baseUrl + 'rank/get',
      JSON.stringify(data),
      this.options
    );
  }



  getAllServiceDetailsWithPostingType(pageIndex: number, pageSize: number, ORDER_TYPE: any, RANK_ID: any, MUL_RANK_ID: any, SELECTED_EMP_ID: any[], OFFICE_ID: any, POST_TYPE_ID: any, likeQuery: any, POSTING_YEAR: any): Observable<any> {

    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      ORDER_TYPE: ORDER_TYPE,
      RANK_ID: RANK_ID,
      MUL_RANK_ID: MUL_RANK_ID,
      SELECTED_EMP_ID: SELECTED_EMP_ID,
      OFFICE_ID: OFFICE_ID,
      POST_TYPE_ID: POST_TYPE_ID,
      filter: likeQuery,
      POSTING_YEAR: POSTING_YEAR
    };

    return this.httpClient.post<any>(this.url + 'postOrderDetails/getPostingEmployees', JSON.stringify(data), this.options);
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
      this.baseUrl + 'class/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllRank(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any[]> {
    var data = {
      pageIndex: pageIndex, pageSize: pageSize, sortKey: sortKey, sortValue: sortValue, filter: filter
    };
    return this.httpClient.post<any[]>(this.baseUrl + 'rank/get', JSON.stringify(data), this.options);
  }

  getAllOffice(
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


  getallOffice(
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
      this.baseUrl + 'office/get',
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
      this.baseUrl + 'city/get',
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
      this.baseUrl + 'State/get',
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


  getAllEmployee(pageIndex: any, pageSize: any, sortKey: string, sortValue: string, filter: string): Observable<any> {
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
      this.baseUrl + 'officeStaffDetails/get',
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




}

