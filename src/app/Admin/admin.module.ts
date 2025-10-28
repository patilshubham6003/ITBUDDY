import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin1Component } from './admin1/admin1.component';
import { Admin2Component } from './admin2.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NZ_I18N, NzI18nModule, en_US } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { RoleComponent } from './forms and roles/Roles/role/role.component';
import { RoledetailsComponent } from './forms and roles/Roles/roledetails/roledetails.component';
import { RolesComponent } from './forms and roles/Roles/roles/roles.component';
import { FormsComponent } from './forms and roles/Forms/forms/forms.component';
import { FormComponent } from './forms and roles/Forms/form/form.component';

import { AboutFormComponent } from './pages/about/about-form/about-form.component';
import { AboutMasterComponent } from './pages/about/about-master/about-master.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddwebsitebannerComponent } from './pages/websitebanner/addwebsitebanner/addwebsitebanner.component';
import { DownloadsComponent } from './pages/download_info/downloads/downloads.component';

import { FaqHeadComponent } from './pages/FaqHead/faq-head/faq-head.component';
import { FaqHeadsComponent } from './pages/FaqHead/faq-heads/faq-heads.component';
import { BenefitMasterComponent } from './pages/benefits/benefit-master/benefit-master.component';
import { BenefitsComponent } from './pages/benefits/benefits/benefits.component';
import { ContactMasterComponent } from './pages/contact/contact-master/contact-master.component';
import { ContactsComponent } from './pages/contact/contacts/contacts.component';
import { ContactDirectoryMasterComponent } from './pages/contact_directory/contact-directory-master/contact-directory-master.component';
import { ContactDirectoryComponent } from './pages/contact_directory/contact-directory/contact-directory.component';
import { DownloadMasterComponent } from './pages/download_info/download-master/download-master.component';
import { EmployeeRegistrationComponent } from './pages/employee_registeration/employee-registration/employee-registration.component';
import { EmployeeComponent } from './pages/employee_registeration/employee/employee.component';
import { FaqresponsesComponent } from './pages/faqmaster/faqresponses/faqresponses.component';
import { FaqsComponent } from './pages/faqmaster/faqs/faqs.component';
import { FeatureMasterComponent } from './pages/features/feature-master/feature-master.component';
import { FeaturesComponent } from './pages/features/features/features.component';
import { GalleryMasterComponent } from './pages/gallery/gallery-master/gallery-master.component';
import { GalleryComponent } from './pages/gallery/gallery/gallery.component';
import { GalleryCategoryMasterComponent } from './pages/gallery_category/gallery-category-master/gallery-category-master.component';
import { GalleryCategoryComponent } from './pages/gallery_category/gallery-category/gallery-category.component';
import { NewsComponent } from './pages/news/news/news.component';
import { ServiceMasterComponent } from './pages/service/service-master/service-master.component';
import { ServicesComponent } from './pages/service/services/services.component';
// import { UsercontactsComponent } from './pages/usercontact/usercontacts/usercontacts.component';
import { VideoMasterComponent } from './pages/video_album/video-master/video-master.component';
import { VideosComponent } from './pages/video_album/videos/videos.component';
import { WebsitebannerComponent } from './pages/websitebanner/websitebanner/websitebanner.component';
import { UserComponent } from './forms and roles/user/user/user.component';
import { UsersComponent } from './forms and roles/user/users/users.component';
// import { FaqComponent } from './pages/faqmaster/faq/faq.component';
import { NewsMasterComponent } from './pages/news/news-master/news-master.component';
import { UsercontactsComponent } from './pages/usercontact/usercontacts/usercontacts.component';
import { FaqComponent } from './pages/faqmaster/faq/faq.component';
import { WebdashboardComponent } from './pages/webdashboard/webdashboard.component';
import { StatMasterComponent } from './pages/stat/stat-master/stat-master.component';
import { StatComponent } from './pages/stat/stat/stat.component';
import { DesignationComponent } from './pages/designation/designation/designation.component';
import { DesignationMasterComponent } from './pages/designation/designation-master/designation-master.component';
import { SearchFilterPipe } from './forms and roles/Roles/roledetails/Pipe';
import { AdminsignatureMasterComponent } from './pages/adminsignature/adminsignature-master/adminsignature-master.component';
import { AdminsignatureFormComponent } from './pages/adminsignature/adminsignature-form/adminsignature-form.component';
import { AdminnotificationComponent } from './pages/adminnotification/adminnotification.component';
import { EmpregistrationdrawerComponent } from './pages/empregistration/empregistrationdrawer/empregistrationdrawer.component';
import { EmpregistrationlistComponent } from './pages/empregistration/empregistrationlist/empregistrationlist.component';
import { NewtransferreportComponent } from './pages/newtransferreport/newtransferreport.component';
import { TpcelllistComponent } from './pages/tpcellForm/tpcelllist/tpcelllist.component';
import { TpcelldrawerComponent } from './pages/tpcellForm/tpcelldrawer/tpcelldrawer.component';
import { GroupbTransferRequestsdrawerComponent } from './pages/groupb-transfer-requestsdrawer/groupb-transfer-requestsdrawer.component';
import { GroupbTransferRequestsListComponent } from './pages/groupb-transfer-requests-list/groupb-transfer-requests-list.component';
import { UserProfileDetailsAdminComponent } from './pages/user-profile-details-admin/user-profile-details-admin.component';
import { UserProfilefamilyAdminComponent } from './pages/user-profilefamily-admin/user-profilefamily-admin.component';
import { ProfilecompletionlistComponent } from './pages/profilecompletionlist/profilecompletionlist.component';
import { ViewprofilecomplitionComponent } from './pages/viewprofilecomplition/viewprofilecomplition.component';
import { PendingregistrationlistComponent } from './pages/pending/pendingregistrationlist/pendingregistrationlist.component';
import { OtpreportComponent } from './pages/Reports_Admin/otpreport/otpreport.component';
import { RegistrationReportComponent } from './pages/Reports_Admin/registration-report/registration-report.component';
import { FeedbackmasterComponent } from './pages/feedbackmaster/feedbackmaster.component';
import { IpremployeelistComponent } from './pages/ipremployeelist/ipremployeelist.component';
import { PostingdetailsverificationComponent } from './pages/postingdetailsverification/postingdetailsverification.component';
import { EmployeeRetirementReportComponent } from './pages/cmsreports/employee-retirement-report/employee-retirement-report.component';
import { IthrSummaryReportComponent } from './pages/cmsreports/ithr-summary-report/ithr-summary-report.component';
import { OfficeAsOnDateSummaryComponent } from './pages/cmsreports/office-as-on-date-summary/office-as-on-date-summary.component';
import { NewEmployeesDetailsDashComponent } from './pages/cmsreports/new-employees-details-dash/new-employees-details-dash.component';
import { UpcomingretirmentreportComponent } from './pages/cmsreports/upcomingretirmentreport/upcomingretirmentreport.component';
import { AbscondingReportComponent } from './pages/cmsreports/absconding-report/absconding-report.component';
import { CaderwisesummaryreportComponent } from './pages/cmsreports/caderwisesummaryreport/caderwisesummaryreport.component';
import { JaosummaryreportComponent } from './pages/cmsreports/jaosummaryreport/jaosummaryreport.component';
import { AllemployeereportComponent } from './pages/cmsreports/allemployeereport/allemployeereport.component';
import { CmsfileuploadlistComponent } from './pages/cmsfileuploadlist/cmsfileuploadlist.component';
import { PendinggenralreqComponent } from './pages/pendinggenralreq/pendinggenralreq.component';
import { UploadithrfilelistComponent } from './pages/uploadithrfilelist/uploadithrfilelist.component';
import { TpListComponent } from './pages/TP/tp-list/tp-list.component';



@NgModule({
  declarations: [
    Admin1Component,
    SearchFilterPipe,
    Admin2Component,
    RoleComponent,
    RoledetailsComponent,
    RolesComponent,
    FormComponent,
    FormsComponent,
    UserComponent,
    UsersComponent,
    NewsMasterComponent,
    NewtransferreportComponent,
    AboutFormComponent,
    AboutMasterComponent,
    ServiceMasterComponent,
    ServicesComponent,
    WebsitebannerComponent,
    AddwebsitebannerComponent,
    EmpregistrationdrawerComponent,
    EmpregistrationlistComponent,
    NewsComponent,
    ContactMasterComponent,
    ContactsComponent,
    UsercontactsComponent,
    FeatureMasterComponent,
    FeaturesComponent,
    BenefitMasterComponent,
    BenefitsComponent,
    GalleryMasterComponent,
    GalleryComponent,
    GalleryCategoryComponent,
    GalleryCategoryMasterComponent,
    DownloadMasterComponent,
    DownloadsComponent,
    ContactDirectoryMasterComponent,
    ContactDirectoryComponent,
    EmployeeRegistrationComponent,
    EmployeeComponent,
    VideoMasterComponent,
    VideosComponent,
    FaqComponent,
    FaqHeadComponent,
    FaqHeadsComponent,
    FaqresponsesComponent,
    FaqsComponent,
    WebdashboardComponent,
    StatMasterComponent,
    StatComponent,
    DesignationComponent,
    DesignationMasterComponent,
    AdminsignatureMasterComponent,
    AdminsignatureFormComponent,
    AdminnotificationComponent,
    TpcelllistComponent,
    TpcelldrawerComponent,
    GroupbTransferRequestsListComponent,
    GroupbTransferRequestsdrawerComponent,
    UserProfileDetailsAdminComponent,
    UserProfilefamilyAdminComponent,
    ViewprofilecomplitionComponent,
    ProfilecompletionlistComponent,
    PendingregistrationlistComponent,
    OtpreportComponent,
    RegistrationReportComponent,
    FeedbackmasterComponent,
    IpremployeelistComponent,
    PostingdetailsverificationComponent,
    EmployeeRetirementReportComponent,
    IthrSummaryReportComponent,
    OfficeAsOnDateSummaryComponent,
    NewEmployeesDetailsDashComponent,
    UpcomingretirmentreportComponent,
    AbscondingReportComponent,
    CaderwisesummaryreportComponent,
    JaosummaryreportComponent,
    AllemployeereportComponent,
    CmsfileuploadlistComponent,
    PendinggenralreqComponent,
    UploadithrfilelistComponent,
    TpListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    NzAffixModule,
    NzAlertModule,
    NzAnchorModule,
    NzAutocompleteModule,
    NzAvatarModule,
    NzBackTopModule,
    NzBadgeModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzCalendarModule,
    NzCardModule,
    NzCarouselModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzCommentModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzDrawerModule,
    NzDropDownModule,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzI18nModule,
    NzIconModule,
    NzImageModule,
    NzInputModule,
    NzInputNumberModule,
    NzLayoutModule,
    NzListModule,
    NzMentionModule,
    NzMenuModule,
    NzMessageModule,
    NzModalModule,
    NzNoAnimationModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzProgressModule,
    NzRadioModule,
    NzRateModule,
    NzResultModule,
    NzSegmentedModule,
    NzSelectModule,
    NzSkeletonModule,
    NzSliderModule,
    NzSpaceModule,
    NzSpinModule,
    NzStatisticModule,
    NzStepsModule,
    NzSwitchModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimePickerModule,
    NzTimelineModule,
    NzToolTipModule,
    NzTransButtonModule,
    NzTransferModule,
    NzTreeModule,
    NzTreeViewModule,
    NzTreeSelectModule,
    NzTypographyModule,
    NzUploadModule,
    NzWaveModule,
    NzResizableModule,
    NzPipesModule,
    AngularEditorModule,
    ColorPickerModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class AdminModule { }
