import { Injectable } from '@angular/core';
import { appkeys } from '../app.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
// import { Form } from '@angular/forms';
import { Role } from '../commonModule/role';
import { Roledetails } from '../commonModule/roledetails';
import { Form } from '../commonModule/form';
import { About } from '../Modal/about';
import { User } from '../commonModule/user';
import { categoryMaster } from '../commonModule/categoryMaster';
import { Faq } from '../Modal/faq';
import { WebsiteBannerMaster } from '../Modal/WebsiteBannerMaster';
import { Contact } from '../Modal/contact';
import { News } from '../Modal/news';
import { Service } from '../Modal/service';
import { contactInfo } from '../Modal/usercontact';
import { Faqresponse } from '../Modal/Faqresponse';
import { FaqHead } from '../Modal/Faqhead';
import { Download } from '../Modal/download';
import { ContactDirectory } from '../Modal/contact_directory';
import { Employee } from '../Modal/employee_registration';
import { Video } from '../Modal/video';
import { Gallery } from '../Modal/gallery';
import { Benefits } from '../Modal/benefits';
import { Feature } from '../Modal/feature';
import { Gallerycategory } from '../Modal/gallery_category';
import { Designation } from '../Modal/designation';
import { Stat } from '../Modal/stat';
import { EmployeeReg } from '../Modal/empregistration2';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  Baseurl = appkeys.baseUrl;
  url = appkeys.url;
  clientId = 1;
  baseUrl = appkeys.baseUrl;
  imgUrl1 = appkeys.imgUrl1;
  retrieveimgUrl = appkeys.retriveimgUrl;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  //   loggerUrl = appkeys.gmUrl
  // gmUrl = appkeys.gmUrl;

  fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  retriveimgUrl: string = '';

  // Local
  // application = 7WDlo2KuSFlyB2uu
  // api = pr5siXqdWEUAkt2hanAXncNn2sZzh6Kn

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
  //   this.httpHeaders1 = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
  //     applicationkey: '1fR4UanlaUrylXe5',
  //     deviceid: this.cookie.get('deviceId'),
  //   });
  //   this.options1 = {
  //     headers: this.httpHeaders1,
  //   };
  //   var data = {
  //     CLIENT_ID: this.clientId,
  //   };
  //   return this.httpClient.post(
  //     this.gmUrl + 'device/init',
  //     JSON.stringify(data),
  //     this.options1
  //   );
  // }
  onUpload(folderName: any, selectedFile: any, filename: any) {
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
    this.httpClient
      .post(appkeys.imgUrl1 + folderName, fd, this.options1)
      .subscribe((res) => {});
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
    form['CLIENT_ID'] = this.clientId;
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
  getNewRole(
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
      ROLE_ID: sessionStorage.getItem('ROLE_ID'),
    };
    return this.httpClient.post<any[]>(
      this.url + 'folderConfig/newRole',
      JSON.stringify(data),
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

  loginemployee(email: string, password: string) {
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

  getForms(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<Roledetails>(
      this.url + 'user/getForms',
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
  empget(
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
      this.url + 'employee/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUser(user: User): Observable<number> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'user/create',
      JSON.stringify(user),
      this.options
    );
  }

  updateUser(user: User): Observable<number> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'user/update',
      JSON.stringify(user),
      this.options
    );
  }
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

  getAllAbout(
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
    return this.httpClient.post<About[]>(
      this.baseUrl + 'api/about/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAbout(about: About) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/about/create',
      JSON.stringify(about),
      this.options
    );
  }

  updateAbout(about: About) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/about/update',
      JSON.stringify(about),
      this.options
    );
  }

  getAllService(
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
    return this.httpClient.post<Service[]>(
      this.baseUrl + 'api/service/get',
      JSON.stringify(data),
      this.options
    );
  }

  createService(service: Service) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/service/create',
      JSON.stringify(service),
      this.options
    );
  }

  updateService(service: Service) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/service/update',
      JSON.stringify(service),
      this.options
    );
  }

  getAllwebsiteBanner(
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
    return this.httpClient.post<WebsiteBannerMaster[]>(
      this.baseUrl + 'api/websiteBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createwebsiteBanner(websiteBanner: WebsiteBannerMaster) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/websiteBanner/create',
      JSON.stringify(websiteBanner),
      this.options
    );
  }

  updatewebsiteBanner(websiteBanner: WebsiteBannerMaster) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/websiteBanner/update',
      JSON.stringify(websiteBanner),
      this.options
    );
  }

  getAllFaq(
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
    return this.httpClient.post<Faq[]>(
      this.baseUrl + 'api/faq/get',
      JSON.stringify(data),
      this.options
    );
  }

  createFaq(faq: Faq) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/faq/create',
      JSON.stringify(faq),
      this.options
    );
  }

  updateFaq(faq: Faq) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/faq/update',
      JSON.stringify(faq),
      this.options
    );
  }

  getAllNews(
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
    return this.httpClient.post<News[]>(
      this.baseUrl + 'api/news/get',
      JSON.stringify(data),
      this.options
    );
  }

  createNews(news: News) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/news/create',
      JSON.stringify(news),
      this.options
    );
  }

  updateNews(news: News) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/news/update',
      JSON.stringify(news),
      this.options
    );
  }

  getAllContact(
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
    return this.httpClient.post<Contact[]>(
      this.baseUrl + 'api/contactinfo/get',
      JSON.stringify(data),
      this.options
    );
  }

  createContact(Contact: Contact) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/contactinfo/create',
      JSON.stringify(Contact),
      this.options
    );
  }

  updateContact(Contact: Contact) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/contactinfo/update',
      JSON.stringify(Contact),
      this.options
    );
  }

  getAllFeature(
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
    return this.httpClient.post<Feature[]>(
      this.baseUrl + 'api/feature/get',
      JSON.stringify(data),
      this.options
    );
  }

  createFeature(feature: Feature) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/feature/create',
      JSON.stringify(feature),
      this.options
    );
  }

  updateFeature(feature: Feature) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/feature/update',
      JSON.stringify(feature),
      this.options
    );
  }

  getAllBenefit(
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
    return this.httpClient.post<Benefits[]>(
      this.baseUrl + 'api/benefit/get',
      JSON.stringify(data),
      this.options
    );
  }

  createBenefit(Benifit: Benefits) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/benefit/create',
      JSON.stringify(Benifit),
      this.options
    );
  }

  updateBenefit(Benifit: Benefits) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/benefit/update',
      JSON.stringify(Benifit),
      this.options
    );
  }

  getAllGallerycategory(
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
    return this.httpClient.post<Gallerycategory[]>(
      this.baseUrl + 'api/gallaryCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  createGallerycategory(Gallerycategory: Gallerycategory) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/gallaryCategory/create',
      JSON.stringify(Gallerycategory),
      this.options
    );
  }

  updateGallerycategory(Gallerycategory: Gallerycategory) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/gallaryCategory/update',
      JSON.stringify(Gallerycategory),
      this.options
    );
  }

  getAllGallery(
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
    return this.httpClient.post<Gallery[]>(
      this.baseUrl + 'api/gallary/get',
      JSON.stringify(data),
      this.options
    );
  }

  createGallery(Gallery: Gallery) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/gallary/create',
      JSON.stringify(Gallery),
      this.options
    );
  }

  updateGallery(Gallery: Gallery) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/gallary/update',
      JSON.stringify(Gallery),
      this.options
    );
  }
  getContactInfo(
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
    return this.httpClient.post<contactInfo[]>(
      this.baseUrl + 'api/userContact/get',
      JSON.stringify(data),
      this.options
    );
  }
  getotpdata(
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
    return this.httpClient.post<contactInfo[]>(
      this.baseUrl + 'api/otpReport/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllVideoMaster(
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
    return this.httpClient.post<Video[]>(
      this.baseUrl + 'api/video/get',
      JSON.stringify(data),
      this.options
    );
  }

  createVideoMaster(Video: Video) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/video/create',
      JSON.stringify(Video),
      this.options
    );
  }

  updateVideoMaster(Video: Video) {
    return this.httpClient.put<number>(
      this.baseUrl + 'api/video/update',
      JSON.stringify(Video),
      this.options
    );
  }
  getAllEmployee(
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
    return this.httpClient.post<Employee[]>(
      this.baseUrl + 'api/employeeRegistration/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateEmployee(employee: Employee) {
    return this.httpClient.post<number>(
      this.baseUrl + 'api/employeeRegistration/approveRegistrationRequest',
      JSON.stringify(employee),
      this.options
    );
  }

  getDownloads(
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
    return this.httpClient.post<Download[]>(
      this.baseUrl + 'api/download/get',
      JSON.stringify(data),
      this.options
    );
  }

  ///////////////////////

  updateDownload(download: Download) {
    download['CLIENT_ID'] = this.clientId;
    return this.httpClient.put<number>(
      this.baseUrl + 'api/download/update',
      JSON.stringify(download),
      this.options
    );
  }

  // createDownloads(download: Download) {
  //   download['CLIENT_ID'] = this.clientId;
  //   return this.httpClient.post<number>(
  //     this.baseUrl + 'api/download/create',
  //     JSON.stringify(download),
  //     this.options
  //   );
  // }

  getContactDirectory(
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
    return this.httpClient.post<ContactDirectory[]>(
      this.baseUrl + 'api/contactDirectory/get',
      JSON.stringify(data),
      this.options
    );
  }
  updateContactDirectory(Contact: ContactDirectory) {
    Contact['CLIENT_ID'] = this.clientId;
    return this.httpClient.put<number>(
      this.baseUrl + 'api/contactDirectory/update',
      JSON.stringify(Contact),
      this.options
    );
  }
  createContactDirectory(Contact: ContactDirectory) {
    Contact['CLIENT_ID'] = this.clientId;
    return this.httpClient.post<number>(
      this.baseUrl + 'api/contactDirectory/create',
      JSON.stringify(Contact),
      this.options
    );
  }
  getOfficeMaster(
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
      this.baseUrl + 'api/office/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllFaqs(
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
    return this.httpClient.post<Download[]>(
      this.baseUrl + 'api/faq/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllFaqResponses(
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
    return this.httpClient.post<Download[]>(
      this.baseUrl + 'api/faqResponses/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateFaqHead(Faqhead: FaqHead) {
    Faqhead['CLIENT_ID'] = this.clientId;
    return this.httpClient.put<number>(
      this.baseUrl + 'api/faqHead/update',
      JSON.stringify(Faqhead),
      this.options
    );
  }

  createFaqHead(Faqhead: FaqHead) {
    Faqhead['CLIENT_ID'] = this.clientId;
    return this.httpClient.post<number>(
      this.baseUrl + 'api/faqHead/create',
      JSON.stringify(Faqhead),
      this.options
    );
  }

  getAllFaqHeads(
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
      this.url + 'faqHead/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateFaqResponse(data: Faqresponse): Observable<number> {
    return this.httpClient.put<number>(
      this.url + 'faqResponse/update',
      data,
      this.options
    );
  }
  onUpload11(
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

  getAllStat(
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
    return this.httpClient.post<Stat[]>(
      this.baseUrl + 'api/stat/get',
      JSON.stringify(data),
      this.options
    );
  }

  createStat(stat: Stat) {
    return this.httpClient.post<Stat>(
      this.baseUrl + 'api/stat/create',
      JSON.stringify(stat),
      this.options
    );
  }

  updateStat(stat: Stat) {
    return this.httpClient.put<Stat>(
      this.baseUrl + 'api/stat/update',
      JSON.stringify(stat),
      this.options
    );
  }
  createDownloads(download: Download) {
    download['CLIENT_ID'] = this.clientId;
    return this.httpClient.post<number>(
      this.baseUrl + 'api/download/createBulk',
      JSON.stringify(download),
      this.options
    );
  }

  getAllDesignation(
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

    return this.httpClient.post<Designation[]>(
      this.baseUrl + 'api/designation/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDesignation(Designation: Designation) {
    return this.httpClient.post<Designation>(
      this.baseUrl + 'api/designation/create',
      JSON.stringify(Designation),
      this.options
    );
  }

  updateDesignation(Designation: Designation) {
    return this.httpClient.put<Designation>(
      this.baseUrl + 'api/designation/update',
      JSON.stringify(Designation),
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

  getadminSignature(
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

  createadminSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    var data = Object.assign({}, role);

    return this.httpClient.post<any>(
      this.url + 'signature/create/',

      JSON.stringify(data),

      this.options
    );
  }

  updateadminSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    var data = Object.assign({}, role);

    return this.httpClient.put<any>(
      this.url + 'signature/update/',

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

  empCreate(user: EmployeeReg): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post(
      this.url + 'employee/createEmployee',
      JSON.stringify(user),
      this.options
    );
  }

  empUpdate(user: EmployeeReg): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put(
      this.url + 'employee/updateNICEmployee',
      JSON.stringify(user),
      this.options
    );
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

  getmappedbuildingget(
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
      this.baseUrl + 'api/caretakerbuildingMapping/get',
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

  empregistrationget(
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
      this.url + 'employeeRegistration/getCount',
      JSON.stringify(data),
      this.options
    );
  }

  approvereject(data: any) {
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
      this.url + 'employeeRegistration/approveRegistration',
      JSON.stringify(data),
      this.options
    );
  }

  feedbackmasterget(
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
      this.url + 'feedback/get',
      JSON.stringify(data),
      this.options
    );
  }


  feedbackupdate(data: any) {
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
      this.url + 'feedback/update',
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

  // downloadFile(url: string) {
  //   return this.httpClient.get(url, { responseType: 'blob' }); // Fetch the PDF as a blob
  // }


  // downloadFile(url: string) {
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
  //   return this.httpClient.put(
  //     headers: this.httpHeaders,
  //     responseType: 'blob' as 'json', 
  //   );
  // }

  // downloadFile(url: string): Observable<Blob> {
  //   const httpHeaders = new HttpHeaders({
  //     'Access-Control-Allow-Origin': '*',
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: localStorage.getItem('deviceId') || '', // Use cookies or localStorage as needed
  //     supportkey: localStorage.getItem('supportKey') || '',
  //     Token: localStorage.getItem('token') || '',
  //   });

  //   const options = {
  //     headers: httpHeaders,
  //     responseType: 'blob' as 'json', // Expect binary data
  //   };

  //   return this.httpClient.get<Blob>(url, options); // Return the observable for the component to handle
  // }


  // downloadFile(url: string): Observable<Blob> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //   });

  //   return this.http.get(url, {
  //     headers,
  //     responseType: 'blob', // Expect binary data
  //   });
  // }



  // downloadFile(
  //   url
  // ): Observable<any> {
  //   var data = {
  //     'filename':url
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'download/iPRForms',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  downloadFile(url: string): Observable<Blob> {
    const data = {
      filename: url
    };
  
    return this.httpClient.post<Blob>(
      this.Baseurl + 'download/iPRForms',
      JSON.stringify(data),
      {
        ...this.options,
        responseType: 'blob' as 'json' // Add responseType: 'blob'
      }
    );
  }



  updatepostingrequest(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.put<any>(
      this.baseUrl + 'api/tempPostingDetails/update',
      JSON.stringify(data),
      this.options
    );
  }
  updategenralrequest(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.put<any>(
      this.baseUrl + 'api/ithrEmployeeGeneralRequest/update',
      JSON.stringify(data),
      this.options
    );
  }
  createnewmbdfile(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/ithrMdbFile/create',
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
  getallgenralreqcount(
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
      this.baseUrl + 'api/ithrEmployeeGeneralRequest/getGeneralRequestCount',
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


  updatepostingdetails(form: any): Observable<any> {
    var data = {
      ...form,
    };
    return this.httpClient.put<any>(
      this.baseUrl + 'api/postingDetails/update',
      JSON.stringify(data),
      this.options
    );
  }


  employeeRetirementDetailedReport(
    pageIndex: any,
    pageSize: any,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };
    return this.httpClient.post<any>(
      this.url + 'ithrRetiredData/get',
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

  getAllOfficeForTransfer1111(
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
      this.baseUrl + 'api/office/getCurrentOffices',
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
  getretirmenttypedata(
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
      this.baseUrl + 'api/ithrRetirementType/get',
      JSON.stringify(data),
      this.options
    );
  }
  


  getCardDashboardReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    FROM_DATE: string,
    TO_DATE: string,
    IS_GAZZETTED: any

  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      IS_GAZZETTED: IS_GAZZETTED
    };
    return this.httpClient.post<any>(
      this.url + 'cardDashboardReport/getCardDashboardReport',
      JSON.stringify(data),
      this.options
    );
  }


  getofficeAsOnDateSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    OFFICE_ID:any,
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      OFFICE_ID:OFFICE_ID
    };

    return this.httpClient.post<any>(
      this.url + 'ithrRetiredData/getOfficeStrengthReport',
      JSON.stringify(data),
      this.options
    );
  }


  getAllEmployeefordash(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/employee/get',
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


  getretrimentcount(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/ithrRetiredData/getRetirementTypeWiseCount',
      JSON.stringify(data),
      this.options
    );
  }
  getabscoundingcount(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/ithrRetiredData/getAbscondingCount',
      JSON.stringify(data),
      this.options
    );
  }
  getotherdashcount(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string,OFFICE_ID:any,START_DATE:any,END_DATE:any,RANK_ID:any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      OFFICE_ID:OFFICE_ID,
      START_DATE:START_DATE,
      END_DATE:END_DATE,
      RANK_ID:RANK_ID
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/ithrRetiredData/getOverallOfficeStrength',
      JSON.stringify(data),
      this.options
    );
  }



  getabcoundingreportdata(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDetails/get',
      JSON.stringify(data),
      this.options
    );
  }




  gercaderwisedata(
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
      filter: filter
    };

    return this.httpClient.post<any>(
      this.url + 'cmsReport/get',
      JSON.stringify(data),
      this.options
    );
  }
  getofficewisedata(
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
      filter: filter
    };

    return this.httpClient.post<any>(
      this.url + 'cmsReport/getOfficeWise',
      JSON.stringify(data),
      this.options
    );
  }
  getjaowisedata(
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
      filter: filter
    };

    return this.httpClient.post<any>(
      this.url + 'cmsReport/getGroupWise',
      JSON.stringify(data),
      this.options
    );
  }


  getallfile(
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
      this.baseUrl + 'api/ithrMdbFile/get',
      JSON.stringify(data),
      this.options
    );
  }

  onUpload1212(folderName: any, selectedFile: any, filename: any): Observable<any> {
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
}

