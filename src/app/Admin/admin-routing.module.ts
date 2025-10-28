import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin2Component } from './admin2.component';
import { FormsComponent } from './forms and roles/Forms/forms/forms.component';

import { RolesComponent } from './forms and roles/Roles/roles/roles.component';
import { AboutMasterComponent } from './pages/about/about-master/about-master.component';
import { UsersComponent } from './forms and roles/user/users/users.component';
import { ContactMasterComponent } from './pages/contact/contact-master/contact-master.component';
import { FaqHeadsComponent } from './pages/FaqHead/faq-heads/faq-heads.component';
import { BenefitMasterComponent } from './pages/benefits/benefit-master/benefit-master.component';
import { DownloadMasterComponent } from './pages/download_info/download-master/download-master.component';
import { FaqsComponent } from './pages/faqmaster/faqs/faqs.component';
import { FeatureMasterComponent } from './pages/features/feature-master/feature-master.component';
import { GalleryMasterComponent } from './pages/gallery/gallery-master/gallery-master.component';
import { GalleryCategoryMasterComponent } from './pages/gallery_category/gallery-category-master/gallery-category-master.component';
import { ServiceMasterComponent } from './pages/service/service-master/service-master.component';
import { UsercontactsComponent } from './pages/usercontact/usercontacts/usercontacts.component';
import { VideoMasterComponent } from './pages/video_album/video-master/video-master.component';
import { WebsitebannerComponent } from './pages/websitebanner/websitebanner/websitebanner.component';
import { NewsMasterComponent } from './pages/news/news-master/news-master.component';
import { ContactDirectoryComponent } from './pages/contact_directory/contact-directory/contact-directory.component';
import { WebdashboardComponent } from './pages/webdashboard/webdashboard.component';
import { StatMasterComponent } from './pages/stat/stat-master/stat-master.component';
import { DesignationMasterComponent } from './pages/designation/designation-master/designation-master.component';
import { AdminsignatureMasterComponent } from './pages/adminsignature/adminsignature-master/adminsignature-master.component';
import { EmpregistrationlistComponent } from './pages/empregistration/empregistrationlist/empregistrationlist.component';
import { NewtransferreportComponent } from './pages/newtransferreport/newtransferreport.component';
import { TpcelllistComponent } from './pages/tpcellForm/tpcelllist/tpcelllist.component';
import { GroupbTransferRequestsListComponent } from './pages/groupb-transfer-requests-list/groupb-transfer-requests-list.component';
import { ProfilecompletionlistComponent } from './pages/profilecompletionlist/profilecompletionlist.component';
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
import { PendinggenralreqComponent } from './pages/pendinggenralreq/pendinggenralreq.component';
import { UploadithrfilelistComponent } from './pages/uploadithrfilelist/uploadithrfilelist.component';
import { TpListComponent } from './pages/TP/tp-list/tp-list.component';

// import { Admin1Component } from './admin1/admin1.component';

const routes: Routes = [
  {
    path: '',
    component: Admin2Component,
    children: [
      { path: 'forms', component: FormsComponent },
      // { path: 'nenotificationsws', component: NewsMasterComponent},
      // { path: 'role', component: RolesComponent},
      { path: 'users', component: UsersComponent },
      // { path: 'about', component: AboutMasterComponent}
      { path: 'role', component: RolesComponent },
      { path: 'web-dashboard', component: WebdashboardComponent },
      { path: 'employee', component: EmpregistrationlistComponent },

      { path: 'servicemaster', component: ServiceMasterComponent },
      { path: 'websitebannermaster', component: WebsitebannerComponent },

      { path: 'newsmaster', component: NewsMasterComponent },
      { path: 'contactmaster', component: ContactMasterComponent },
      { path: 'usercontact', component: UsercontactsComponent },
      { path: 'about', component: AboutMasterComponent },
      { path: 'feature', component: FeatureMasterComponent },
      { path: 'benefits', component: BenefitMasterComponent },
      { path: 'gallerycategory', component: GalleryCategoryMasterComponent },
      { path: 'gallery', component: GalleryMasterComponent },
      // { path: 'employee', component: EmployeeRegistrationComponent },
      { path: 'video', component: VideoMasterComponent },
      { path: 'download_master', component: DownloadMasterComponent },
      { path: 'contactdirectory', component: ContactDirectoryComponent },
      { path: 'faq_head', component: FaqHeadsComponent },
      { path: 'faqmaster', component: FaqsComponent },
      { path: 'statmaster', component: StatMasterComponent },
      { path: 'designationmaster', component: DesignationMasterComponent },
      { path: 'adminsignature', component: AdminsignatureMasterComponent },
      {
        path: 'request-for-transfer-in-annual-general-transfer',
        component: NewtransferreportComponent,
      },
      { path: 'employee-registration', component: TpcelllistComponent },
      {
        path: 'employee-transfer-requests',
        component: GroupbTransferRequestsListComponent,
      },
      {
        path: 'employee-profile-completions',
        component: ProfilecompletionlistComponent,
      },
      {
        path: 'employee-pending-list',
        component: PendingregistrationlistComponent,
      },
      {
        path: 'mobile-email-otp-report',
        component: OtpreportComponent,
      },
      {
        path: 'registration-report',
        component: RegistrationReportComponent,
      },
      {
        path: 'review-feedback',
        component: FeedbackmasterComponent,
      },
      {
        path: 'ipr-employee-form-list',
        component: IpremployeelistComponent,
      },
      {
        path: 'posting-change-request-list',
        component: PostingdetailsverificationComponent,
      },
      {
        path: 'general-change-request-list',
        component: PendinggenralreqComponent,
      },
      {
        path: 'employee-retirement-report',
        component: EmployeeRetirementReportComponent,
      },
      {
        path: 'ithr-summary-report',
        component: IthrSummaryReportComponent,
      },
      {
        path: 'office-wise-strength-report',
        component: OfficeAsOnDateSummaryComponent,
      },
      {
        path: 'cader-wise-strength-report',
        component: CaderwisesummaryreportComponent,
      },
      {
        path: 'jao-fao-wise-report',
        component: JaosummaryreportComponent,
      },
    
      {
        path: 'new-joinees-details-report',
        component: NewEmployeesDetailsDashComponent,
      },
      {
        path: 'upcoming-retirement-report',
        component: UpcomingretirmentreportComponent,
      },
      {
        path: 'absconding-report',
        component: AbscondingReportComponent,
      },
      {
        path: 'employees-detailed-report',
        component: AllemployeereportComponent,
      },
      {
        path: 'backup-file-list',
        component: UploadithrfilelistComponent,
      },
      {
        path: 'representation-for-Transfer-Posting',
        component: TpListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
