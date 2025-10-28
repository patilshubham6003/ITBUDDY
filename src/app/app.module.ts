import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { APP_BASE_HREF, CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HeadermenuComponent } from './Website/headermenu/headermenu.component';
import { AboutusComponent } from './Website/aboutus/aboutus.component';
import { ContactpageComponent } from './Website/contactpage/contactpage.component';
import { DownloadsComponent } from './Website/downloads/downloads.component';
import { EventGalleryComponent } from './Website/event-gallery/event-gallery.component';
import { FaqComponent } from './Website/faq/faq.component';
import { FooterComponent } from './Website/footer/footer.component';
import { ManualsComponent } from './Website/manuals/manuals.component';
import { NewsDetailsPageComponent } from './Website/news-details-page/news-details-page.component';
import { ProfileComponent } from './Website/profile/profile.component';
import { SerContactdirectoryComponent } from './Website/ser-contactdirectory/ser-contactdirectory.component';
import { SerDownloadsComponent } from './Website/ser-downloads/ser-downloads.component';
import { SerbenefitsComponent } from './Website/serbenefits/serbenefits.component';
import { SerfaqComponent } from './Website/serfaq/serfaq.component';
import { SerfeaturesComponent } from './Website/serfeatures/serfeatures.component';
import { ServicedetailComponent } from './Website/servicedetail/servicedetail.component';
import { ServicepageComponent } from './Website/servicepage/servicepage.component';
import { TrainingVideosComponent } from './Website/training-videos/training-videos.component';
import { VedioGalleryComponent } from './Website/vedio-gallery/vedio-gallery.component';
import { Web1Component } from './Website/web1/web1.component';
import { Web2Component } from './Website/web2.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { WebsiteRoutingModule } from './Website/website-routing.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NewfaqComponent } from './Website/newfaq/newfaq.component';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PrivacypolicyComponent } from './Website/privacypolicy/privacypolicy.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { initializeApp } from "firebase/app";

import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { environment } from 'src/environments/environment.prod';
import { EmployeeQuarterDetailsFormComponent } from './Website/employee-quarter-details-form/employee-quarter-details-form.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { EployeeTransferListComponent } from './Website/EployeeTransferList/EployeeTransferList.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NgxPrintModule } from 'ngx-print';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { EmployeeTransferDrawerComponent } from './Website/employee-transfer-drawer/employee-transfer-drawer.component';
import { EmployeeComponent } from './Website/employee/employee.component';
import { FamilydetailProfileComponent } from './Website/familydetail-profile/familydetail-profile.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { IthrMainComponent } from './Website/ithr-main/ithr-main.component';
import { EducationProfileComponent } from '../app/Website/education-profile/education-profile.component';
import { ExamDrawerComponent } from './Website/exam-drawer/exam-drawer.component';
import { FeedbackpageComponent } from './Website/feedbackpage/feedbackpage.component';
import { CmsprofilepageComponent } from './Website/cmsprofilepage/cmsprofilepage.component';
import { CmsviewComponent } from './Website/cmsview/cmsview.component';
import { PostingDetailsComponent } from './Website/posting-details/posting-details.component';
import { DrawerforrepresentationComponent } from './Website/drawerforrepresentation/drawerforrepresentation.component';
import { OldemployeeprofileComponent } from './Website/oldemployeeprofile/oldemployeeprofile.component';
import { RenovationRequestListComponent } from './grass/Pages/NewSeniorityListFolder/renovation-request-list/renovation-request-list.component';


registerLocaleData(en);
initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    // web
    Web1Component,
    Web2Component,
    HeadermenuComponent,
    AboutusComponent,
    FooterComponent,
    ServicepageComponent,
    ContactpageComponent,
    ServicedetailComponent,
    EventGalleryComponent,
    VedioGalleryComponent,
    FaqComponent,
    DownloadsComponent,
    ProfileComponent,
    SerDownloadsComponent,
    SerContactdirectoryComponent,
    SerfeaturesComponent,
    SerbenefitsComponent,
    SerfaqComponent,
    NewsDetailsPageComponent,
    ManualsComponent,
    TrainingVideosComponent,
    NewfaqComponent,
    PrivacypolicyComponent,
    EmployeeQuarterDetailsFormComponent,
    EployeeTransferListComponent,
    EmployeeTransferDrawerComponent,
    FamilydetailProfileComponent,
    EmployeeComponent,
    IthrMainComponent,
    EducationProfileComponent,
    ExamDrawerComponent,
    FeedbackpageComponent,
    CmsprofilepageComponent,
    CmsviewComponent,
    PostingDetailsComponent,
    DrawerforrepresentationComponent,
    OldemployeeprofileComponent,
    RenovationRequestListComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzSelectModule,
    NzModalModule,
    NzResultModule,
    NzInputModule,
    NzDatePickerModule,
    NzPopoverModule,
    NgxPrintModule,
    NzMenuModule,
    NzFormModule,
    NzTableModule,
    NzDrawerModule,
    NzProgressModule,
    NzSpinModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzCheckboxModule,
    NzMessageModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzDatePickerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
    }),
    NzLayoutModule,
    NzCardModule,
    NzTabsModule,

  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    // { provide: APP_BASE_HREF, useValue: '/mithra/' },
    NzNotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
