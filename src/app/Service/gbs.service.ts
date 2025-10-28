import { Injectable } from '@angular/core';
import { appkeys, gbskeys } from '../app.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { roomMaster } from '../gbsmodule/Models/roomMaster';
import { GuestHouseMaster } from '../gbsmodule/Models/GuestHouse';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class GBSService {
  Baseurl = gbskeys.baseUrl;
  url = gbskeys.url;
  url1 = gbskeys.url1;
  clientId = 1;

  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  // loggerUrl = gbskeys.gmUrl;

  fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

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
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',

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
    // window.location.reload();
  }

  //get all any For login menu
  getForms(roleId: number) {
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),
    //   'supportkey': this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<any>(
      this.url + 'user/getForms',
      JSON.stringify(data),
      this.options
    );
  }

  getCheckAccessOfForm(roleId: number, link: string) {
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),
    //   'supportkey': this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
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

  login(email: string, password: string) {
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid': this.cookie.get('deviceId'),
    //   // 'visitorid':this.cookie.get('visitorId'),
    //   'supportkey': this.cookie.get('supportKey'),
    //   // 'Token': this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders
    // };
    var data = {
      username: email,
      password: password,
      // cloudid:this.cloudID,
    };
    return this.httpClient.post<any>(
      this.Baseurl + 'employee/login',
      JSON.stringify(data),
      this.options
    );
  }

  requestPermission(userId: string) {}

  httpHeaders2 = new HttpHeaders({
    Accept: 'application/json',
    // 'apikey': '9876543210',
    //////// For Local ///////
    apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',

    ///////For Testing ////////
    // apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',

    Token: this.cookie.get('token'),
  });
  options2 = {
    headers: this.httpHeaders2,
  };

  //////////////////// Function for headers start ///////////
  getheader() {
    ////// For Local /////

    // this.httpHeaders = new HttpHeaders({
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'B71DIrzfXKPF97Ci',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };

    /////For Testing ////////TQ7JZ1FDsSA1qHED

    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
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
  }
  //////////////////// Function for headers end ///////////

  loggerheader() {
    //////////For Local////////////////

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'B71DIrzfXKPF97Ci',
    //   deviceid: this.cookie.get('deviceId'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };

    ///////For Testing /////////////////

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  onuploadheader() {
    ////////For Local /////////

    // this.httpHeaders1 = new HttpHeaders({
    //   'Accept': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'B71DIrzfXKPF97Ci',
    // deviceid: this.cookie.get('deviceId'),
    // supportkey: this.cookie.get('supportKey'),
    // Token: this.cookie.get('token'),
    // });
    // this.options1 = {
    // headers: this.httpHeaders1,
    // };

    ////////////For Testing //////////

    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
  }

  // loggerInit() {
  //   this.loggerheader();
  //   // this.httpHeaders = new HttpHeaders({
  //   //   'Content-Type': 'application/json',
  //   //   // 'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   //   // 'applicationkey': 'B71DIrzfXKPF97Ci',
  //   //   'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
  //   //   'applicationkey': 'B71DIrzfXKPF97Ci',
  //   //   'deviceid': this.cookie.get('deviceId'),

  //   // });
  //   // this.options = {
  //   //   headers: this.httpHeaders
  //   // };
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

  //methods for role related opearation - ROLE
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

    return this.httpClient.post<any>(
      this.url + 'roleDetail/getData',
      JSON.stringify(data),
      this.options
    );
  }

  //assign all method forms - ROLE_DETAILS
  addRoleDetail(roleId: number, data1: string[]): Observable<any> {
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

  //method for user replated opearation - USER
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

    return this.httpClient.post<any>(
      this.url + 'user/create/',
      JSON.stringify(user),
      this.options
    );
  }

  updateUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + 'user/update/',
      JSON.stringify(user),
      this.options
    );
  }

  //Image Upload Function
  onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
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

  // Export to excel
  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  // About Master
  getAboutMaster(
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
      this.url + 'Aboutus/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createAboutMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'Aboutus/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAboutMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'Aboutus/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Contact Info
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

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'contactInfo/get',
      JSON.stringify(data),
      this.options
    );
  }

  createcontact(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'contactInfo/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatecontact(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'contactInfo/update/',
      JSON.stringify(role),
      this.options
    );
  }

  stagewisestats(
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
      this.url + 'report/inAndOutCountryCount/',
      JSON.stringify(data),
      this.options
    );
  }

  getdaywisecount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    DAY: string,
    MONTH: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      DAY: DAY,
      MONTH: MONTH,
      YEAR: YEAR,
    };

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'report/dayWiseMonthlySaleCount/',
      JSON.stringify(data),
      this.options
    );
  }

  getdaywiseamount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    DAY: string,
    MONTH: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      DAY: DAY,
      MONTH: MONTH,
      YEAR: YEAR,
    };

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'report/dayWiseMonthlySaleAmount/',
      JSON.stringify(data),
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

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'websiteBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createwebsiteBanner(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'websiteBanner/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatewebsiteBanner(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'websiteBanner/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // Product Master
  getAllProductMaster(
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
      this.url + 'products/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/updateProductData',
      JSON.stringify(role),
      this.options
    );
  }

  // Category Master
  getAllCategoryMaster(
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
      this.url + 'category/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createCategoryMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'category/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCategoryMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'category/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllBlogMaster(
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
      this.url + 'blogs/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createBlogMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'blogs/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateBlogMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'blogs/update/',
      JSON.stringify(role),
      this.options
    );
  }

  // Product Summary Report
  getAllProductSummaryreport(
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
      this.url + 'report/getProductOrderSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  // Product Sales Report
  getAllProductSalereport(
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
      this.url + 'report/getProductSaleDetails',
      JSON.stringify(data),
      this.options
    );
  }

  //Order Master
  updateOrderMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'order/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllOrderMaster(
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
      this.url + 'order/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getOTPreport(
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
      this.url + 'report/otpReport/',
      JSON.stringify(data),
      this.options
    );
  }

  // Online payment summary Report report/getCustomerCodDetails
  getAllpaymentreport(
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
      this.url + 'report/getCustomerPaymentDetails/',
      JSON.stringify(data),
      this.options
    );
  }

  getAllCashOnDeliveryreport(
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
      this.url + 'report/getCustomerCodDetails/',
      JSON.stringify(data),
      this.options
    );
  }

  Admindashboardcount(
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
      this.url + 'report/topTenProductSaleReport/',
      JSON.stringify(data),
      this.options
    );
  }

  getlog(
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
      this.url + 'orderLog/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // customer Order summary Report
  getAllcustomerSummaryreport(
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
      this.url + 'report/getCustomerOrderSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  //customer product details
  getAllproductdetailSummaryreport(
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
      this.url + 'report/getProductOrderSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  // customer order details report
  getAllCustomerOrderDetailsReport(
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
      this.url + 'report/getCustomerOrderDetails/',
      JSON.stringify(data),
      this.options
    );
  }

  // New Subscriber Report
  getAllNewSubscriberReport(
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
      this.url + 'newsSubscribers/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // User Contact Report
  getAllUserContactReport(
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
      this.url + 'userContact/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //  Image Get
  getAllImages(
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
      this.url + 'productImages/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateImages(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'productImages/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Ad Banner Master
  getAllAdBanner(
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
      this.url + 'adBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAdBanner(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'adBanner/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAdBanner(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'adBanner/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Unit Master
  getAllUnitMaster(
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
      this.url + 'unit/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUnitMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'unit/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateUnitMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'unit/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Pincode Master
  getPincodeMaster(
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
      this.url + 'ShippingCharges/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createPincode(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'ShippingCharges/create',
      JSON.stringify(role),
      this.options
    );
  }

  updatePincode(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'ShippingCharges/update',
      JSON.stringify(role),
      this.options
    );
  }

  //Address Master
  getAddressMaster(
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
      this.url + 'address/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createAddressMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'address/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAddressMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'address/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //customer master
  getCustomerMaster(
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
      this.url + 'customer/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCustomerMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'customer/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateCustomerMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'customer/update',
      JSON.stringify(role),
      this.options
    );
  }

  // Product Mapping
  getAllProductMapped(
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
      this.url + 'products/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductMap(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductMap(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'products/updateProductData',
      JSON.stringify(role),
      this.options
    );
  }

  getAllCartaddon(
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
      this.url + 'cartAddonDetails/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getAlladdress(
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
      this.url + 'address/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //Get State Master
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

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'state/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateStateMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'state/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createStateMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'state/create/',
      JSON.stringify(role),
      this.options
    );
  }

  getstagewisestats(
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
      this.url + 'packagingCharges/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //Packaging Charges
  getAllPackagingMaster(
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
      this.url + 'packagingCharges/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updatePackagingMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'packagingCharges/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createPackagingMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'packagingCharges/create/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllCountryMaster(
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
      this.url + 'country/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateCountryMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'country/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createCountryMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'country/create/',
      JSON.stringify(role),
      this.options
    );
  }

  //cartaddon master
  getAllCartAddOnMaster(
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
      this.url + 'cartAddon/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateCartAddOnMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'cartAddon/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createCartAddOnMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'cartAddon/create/',
      JSON.stringify(role),
      this.options
    );
  }

  //Payment Transaction
  getAllPaymentTransaction(
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
      this.url + 'paymentTransaction/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //CartItem
  getAllCartItem(
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
      this.url + 'cartItem/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //CartMaster
  getAllCartMaster(
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
      this.url + 'cart/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // Product Master
  getbookingrequest(
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
      this.url + 'productVarientMapping/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createbookingrequest(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'productVarientMapping/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatebookingrequest(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'productVarientMapping/update',
      JSON.stringify(role),
      this.options
    );
  }

  getareaopen(
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
      this.url1 + 'area/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getarea(
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
      this.url + 'area/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createarea(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'area/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatearea(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'area/update',
      JSON.stringify(role),
      this.options
    );
  }

  createregitration(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url1 + 'bookingRequest/create',
      JSON.stringify(role),
      this.options
    );
  }

  sendWhatsAppMsg(
    guestMobileNo: number,
    guestHouseID: number,
    roomID: any,
    checkInDate: any,
    checkOutDate: any,
    guestName: string
  ): Observable<any> {
    var data = {
      CLIENT_ID: this.clientId,
      GUEST_MOBILE_NO: guestMobileNo,
      GUEST_HOUSE_ID: guestHouseID,
      ROOM_ID: roomID,
      CHECK_IN_DATE: checkInDate,
      CHECK_OUT_DATE: checkOutDate,
      GUEST_NAME: guestName,
    };

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'whatsappMsgShoot/sendWhatsAppMsg',
      JSON.stringify(data),
      this.options
    );
  }

  verifyOTP1(EMAIL_ID: string, OTP: string): Observable<any> {
    var data = {
      EMAIL_ID: EMAIL_ID,
      OTP: OTP,
    };

    return this.httpClient.post<any>(
      this.url1 + 'bookingRequest/verifyEmailOtp',
      JSON.stringify(data),
      this.options
    );
  }

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

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'city/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createCityMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'city/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCityMaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'city/update/',
      JSON.stringify(role),
      this.options
    );
  }

  otplogin1(EMAIL_ID: string): Observable<any> {
    var data = {
      EMAIL_ID: EMAIL_ID,
    };

    return this.httpClient.post<any>(
      this.url1 + 'bookingRequest/sendEmailOtp',
      JSON.stringify(data),
      this.options
    );
  }

  getguesthouse(
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
      this.url + 'guestHouse/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createguesthouse(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'guestHouse/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateguesthouse(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'guestHouse/update',
      JSON.stringify(role),
      this.options
    );
  }

  getroommaster(
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
      this.url + 'room/get/',
      JSON.stringify(data),
      this.options
    );
  }

  creatroommaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'room/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateroommaster(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'room/update',
      JSON.stringify(role),
      this.options
    );
  }

  getregisterdata(
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
      this.url + 'bookingRequest/getDetails/',
      JSON.stringify(data),
      this.options
    );
  }

  getBookingStats(filter: string): Observable<any> {
    var data = {
      filter: filter,
    };

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'bookingRequest/getStats/',
      JSON.stringify(data),
      this.options
    );
  }

  bookingconfirmation(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'bookingRequest/updateStatus',
      JSON.stringify(role),
      this.options
    );
  }

  rejectbooking(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'bookingRequest/updateStatus',
      data,
      this.options
    );
  }

  acceptbooking(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'bookingRequest/updateStatus',
      data,
      this.options
    );
  }

  getReasons(
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
      this.Baseurl + 'reason/get',
      JSON.stringify(data),
      this.options
    );
  }

  getGuestHouse(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GuestHouseMaster> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options1 = {
      headers: this.httpHeaders,
    };

    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();

    return this.httpClient.post<GuestHouseMaster>(
      this.url + 'guestHouse/get',
      JSON.stringify(data),
      this.options1
    );
  }

  createGuestHouse(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'guestHouse/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateGuestHouse(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'guestHouse/update',
      JSON.stringify(role),
      this.options
    );
  }

  getRooms(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<roomMaster> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();

    return this.httpClient.post<roomMaster>(
      this.url + 'room/get',
      JSON.stringify(data),
      this.options
    );
  }

  createRooms(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'room/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateRooms(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'room/update',
      JSON.stringify(role),
      this.options
    );
  }

  getGuesthouseDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    guesthouseID: number,
    month: any,
    year: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      GUEST_HOUSE_ID: guesthouseID,
      MONTH: month,
      YEAR: year,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'roomAvailabilityReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  roomAvailabilityReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    monthNum: number,
    YearNum: number,
    totalDays: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: monthNum,
      YEAR: YearNum,
      TOTAL_DAYS: totalDays,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'roomAvailabilityReport/getSummary',
      JSON.stringify(data),
      this.options
    );
  }

  getBookingDetails(
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
      this.url + 'roomBookingDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  getBookingRequest(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    BOOKING_REQ_NO: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      BOOKING_REQ_NO: BOOKING_REQ_NO,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'bookingRequest/getBookingData',
      JSON.stringify(data),
      this.options
    );
  }

  getAvailableRooms(
    guestHouseID: number,
    fromDate: any,
    toDate: any
  ): Observable<roomMaster> {
    var data = {
      GUEST_HOUSE_ID: guestHouseID,
      DATES: [fromDate, toDate],
    };

    this.getheader();

    return this.httpClient.post<roomMaster>(
      this.url + 'bookingRequest/getAvailableRooms',
      JSON.stringify(data),
      this.options
    );
  }

  updatebookingRequestRooms(data: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'bookingRequest/updateRooms',
      JSON.stringify(data),
      this.options
    );
  }

  cancelBooking(bookingID: number): Observable<any> {
    var data = {
      BOOKING_REQ_NO: bookingID,
    };

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'bookingRequest/cancelBooking',
      JSON.stringify(data),
      this.options
    );
  }

  getWhatsAppReport(
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
      this.url + 'whatsappMsgShoot/whatsappReport/',
      JSON.stringify(data),
      this.options
    );
  }
}
