import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { Web1Component } from './Website/web1/web1.component';
import { AboutusComponent } from './Website/aboutus/aboutus.component';
import { ContactpageComponent } from './Website/contactpage/contactpage.component';
import { DownloadsComponent } from './Website/downloads/downloads.component';
import { EventGalleryComponent } from './Website/event-gallery/event-gallery.component';
import { FaqComponent } from './Website/faq/faq.component';
import { ManualsComponent } from './Website/manuals/manuals.component';
import { NewsDetailsPageComponent } from './Website/news-details-page/news-details-page.component';
import { ProfileComponent } from './Website/profile/profile.component';
import { ServicedetailComponent } from './Website/servicedetail/servicedetail.component';
import { ServicepageComponent } from './Website/servicepage/servicepage.component';
import { TrainingVideosComponent } from './Website/training-videos/training-videos.component';
import { VedioGalleryComponent } from './Website/vedio-gallery/vedio-gallery.component';
import { NewfaqComponent } from './Website/newfaq/newfaq.component';
import { PrivacypolicyComponent } from './Website/privacypolicy/privacypolicy.component';
import { EmployeeQuarterDetailsFormComponent } from './Website/employee-quarter-details-form/employee-quarter-details-form.component';
import { EployeeTransferListComponent } from './Website/EployeeTransferList/EployeeTransferList.component';
import { EmployeeComponent } from './Website/employee/employee.component';
import { IthrMainComponent } from './Website/ithr-main/ithr-main.component';
import { FeedbackpageComponent } from './Website/feedbackpage/feedbackpage.component';
import { CmsprofilepageComponent } from './Website/cmsprofilepage/cmsprofilepage.component';
const routes: Routes = [
  // Home
  {
    path: '',
    pathMatch: 'full',
    component: Web1Component,
  },

  // { path: 'website', loadChildren: () => import('./Website/website.module').then(m => m.WebsiteModule),data:{title:'IT Buddy'}},
  {
    path: 'admin',
    loadChildren: () =>
      import('./Admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'claim',
    loadChildren: () =>
      import('./Medical/medical.module').then((m) => m.MedicalModule),
  },
  {
    path: 'grass',
    loadChildren: () =>
      import('./grass/grass.module').then((m) => m.GrassModule),
  },
  {
    path: 'quarter_applications',
    loadChildren: () =>
      import('./QuarterApplications/quarterApplicationsHome.module').then(
        (m) => m.QuarterApplicationsHomeModule
      ),
  },

  // {
  //   path: 'gbs',
  //   loadChildren: () =>
  //     import('./gbsmodule/gbsmodule.module').then((m) => m.GBSModule),
  // },
  // { path: 'edms', loadChildren: () => import('./edms/edms.module').then(m => m.EdmsModule)},
  { path: 'privacy-policy', component: PrivacypolicyComponent },

  { path: 'about-us', component: AboutusComponent },
  { path: 'service', component: ServicepageComponent },
  { path: 'contact-us', component: ContactpageComponent },
  { path: 'feedback-form', component: FeedbackpageComponent },
  // { path: 'service/service-detail', component: ServicedetailComponent},
  { path: 'gallery/photo-gallery', component: EventGalleryComponent },
  { path: 'gallery/video-gallery', component: VedioGalleryComponent },
  { path: 'circulars', component: DownloadsComponent },
  { path: 'manuals', component: ManualsComponent },
  { path: 'traning-videos', component: TrainingVideosComponent },
  { path: 'faqq', component: FaqComponent },
  { path: 'my-profile', component: ProfileComponent },
  { path: 'notifications', component: NewsDetailsPageComponent },
  { path: ':name/notifications', component: NewsDetailsPageComponent },

  { path: 'faq', component: NewfaqComponent },

  { path: 'service/:name', component: ServicedetailComponent },
  { path: ':name/traning-videos', component: TrainingVideosComponent },

  { path: ':name/manuals', component: ManualsComponent },
  { path: ':name/circulars', component: DownloadsComponent },

  {
    path: 'employee-quarter-details-form',
    component: EmployeeQuarterDetailsFormComponent,
  },
  { path: 'transfer-request', component: EployeeTransferListComponent },
  { path: 'it-hr', component: IthrMainComponent },

  { path: 'employee-profile', component: EmployeeComponent },
  { path: 'cms-service', component: CmsprofilepageComponent },

  {
    path: '**',
    redirectTo: '', // Redirect to the 'home' route if the requested route doesn't match any defined routes
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
