import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Grass1Component } from './grass1/grass1.component';
import { GrassComponent } from './grass.component';
import { GrassRoutingModule } from './grass-routing.module';
import { DashboardComponent } from './Pages/CommonModule/Dashboard/dashboard/dashboard.component';
import { FormComponent } from './Pages/CommonModule/Forms/form/form.component';
import { FormsComponent } from './Pages/CommonModule/Forms/forms/forms.component';
import { RoleComponent } from './Pages/CommonModule/Roles/role/role.component';
import { RoledetailsComponent } from './Pages/CommonModule/Roles/roledetails/roledetails.component';
import { RolesComponent } from './Pages/CommonModule/Roles/roles/roles.component';
import { UserComponent } from './Pages/CommonModule/Users/user/user.component';
import { UsersComponent } from './Pages/CommonModule/Users/users/users.component';
import { AddGradPayComponent } from './Pages/GradePayMaster/add-grad-pay/add-grad-pay.component';
import { ListGradPayComponent } from './Pages/GradePayMaster/list-grad-pay/list-grad-pay.component';
import { AddResidenceComponent } from './Pages/ResidenceTypeMaster/add-residence/add-residence.component';
import { ListResidenceComponent } from './Pages/ResidenceTypeMaster/list-residence/list-residence.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { LoginComponent } from './Pages/CommonModule/login/login.component';
import { AddareaComponent } from './Pages/AreaMaster/addarea/addarea.component';
import { ArealistComponent } from './Pages/AreaMaster/arealist/arealist.component';
import { AddCityComponent } from './Pages/CityMaster/add-city/add-city.component';
import { CityListComponent } from './Pages/CityMaster/city-list/city-list.component';
import { AddblockmasterComponent } from './Pages/BlockMaster/addblockmaster/addblockmaster.component';
import { BlockmasterlistComponent } from './Pages/BlockMaster/blockmasterlist/blockmasterlist.component';
import { AddallotmentcheckComponent } from './Pages/AllotmentCheckListMaster/addallotmentcheck/addallotmentcheck.component';
import { AllotmentchecklistComponent } from './Pages/AllotmentCheckListMaster/allotmentchecklist/allotmentchecklist.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { ListAllotementComponent } from './Pages/AllotementMaster/list-allotement/list-allotement.component';
import { AddAllotementComponent } from './Pages/AllotementMaster/add-allotement/add-allotement.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { BuildingDrawerComponent } from './Pages/BUILDING/building-drawer/building-drawer.component';
import { BuildingComponent } from './Pages/BUILDING/building/building.component';
import { FloorDrawerComponent } from './Pages/FLOOR/floor-drawer/floor-drawer.component';
import { FloorComponent } from './Pages/FLOOR/floor/floor.component';
import { QuarterDrawerComponent } from './Pages/QUARTER/quarter-drawer/quarter-drawer.component';
import { QUARTERComponent } from './Pages/QUARTER/quarter/quarter.component';
import { QuarterpendingrequestComponent } from './Pages/AdminQuarterPendingRequest/quarterpendingrequest/quarterpendingrequest.component';
import { ShowQuarterPendingdataComponent } from './Pages/AdminQuarterPendingRequest/show-quarter-pendingdata/show-quarter-pendingdata.component';
import { SenioritylisttableComponent } from './Pages/GenerateSeniorityList/senioritylisttable/senioritylisttable.component';
import { GeneratesenioritylistComponent } from './Pages/GenerateSeniorityList/generatesenioritylist/generatesenioritylist.component';
import { OrderFormComponent } from '../Medical/Transfer Module/Transfer print/order-form/order-form.component';
import { FlatpreferenceaaddComponent } from './Pages/FlatPreferenceMaster/flatpreferenceaadd/flatpreferenceaadd.component';
import { ShowinspectorflatprefComponent } from './Pages/FlatpreflistInspector/FlatPrefListInspector/showinspectorflatpref/showinspectorflatpref.component';
import { ObjectionhistoryComponent } from './Pages/ObjectionMaster/objectionhistory/objectionhistory.component';
import { ObjectionlistforInspectorComponent } from './Pages/ObjectionMaster/objectionlistfor-inspector/objectionlistfor-inspector.component';
import { FlatavailabilityComponent } from './Pages/TempRequiredForms/FlatAvailability/flatavailability/flatavailability.component';
import { SenioritylistusersComponent } from './Pages/ViewSeniorityListToUsers/senioritylistusers/senioritylistusers.component';
import { GrassemployeeloginComponent } from './Pages/grassEmployeelogin/grassemployeelogin/grassemployeelogin.component';
import { GrassemployeeupdateComponent } from './Pages/grassEmployeeupdate/grassemployeeupdate/grassemployeeupdate.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NgxPrintModule } from 'ngx-print';
import { ApplicationFormAllotmentComponent } from './Pages/GrassForms/application-form-allotment/application-form-allotment.component';
import { EmpapplicationviewComponent } from './Pages/Employeeapplictionview/empapplicationview/empapplicationview.component';
import { ShowflatpreftoempComponent } from './Pages/ShowFlatPrefToEmp/showflatpreftoemp/showflatpreftoemp.component';
import { GenerateflatpreflistComponent } from './Pages/GenerateFlatprefflist/generateflatpreflist/generateflatpreflist.component';
import { FlatpreflisttableComponent } from './Pages/GenerateFlatprefflist/flatpreflisttable/flatpreflisttable.component';
import { GenerateseniorityaddComponent } from './Pages/GenerateSenioritylistIII/generateseniorityadd/generateseniorityadd.component';
import { GeneratesenioritylisttableComponent } from './Pages/GenerateSenioritylistIII/generatesenioritylisttable/generatesenioritylisttable.component';
import { VacancyComponent } from './Pages/GrassForms/vacancy/vacancy.component';
import { NoticeVacantComponent } from './Pages/GrassForms/notice-vacant/notice-vacant.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlatallotmentaddComponent } from './Pages/FlatAllotmentMasterFolder/flatallotmentadd/flatallotmentadd.component';
import { FlatallotmentlistComponent } from './Pages/FlatAllotmentMasterFolder/flatallotmentlist/flatallotmentlist.component';
import { AllotmentFormComponent } from './Pages/GrassForms/allotment-form/allotment-form.component';
import { FlatallotmentuserlistComponent } from './Pages/FlatAllotmentuserlist/flatallotmentuserlist/flatallotmentuserlist.component';
import { HeaderstepsComponent } from './Pages/headersteps/headersteps.component';
import { AllotmentdetailsComponent } from './Pages/allotmentdetails/allotmentdetails.component';
import { PreferencesnewComponent } from './Pages/preferencesnew/preferencesnew.component';
import { NewscenaoritylistComponent } from './Pages/newscenaoritylist/newscenaoritylist.component';
import { NewflatAvailableComponent } from './Pages/newflat-available/newflat-available.component';
import { ApplicationMasterComponent } from './Pages/application-master/application-master.component';
import { ApplicationFormComponent } from './Pages/application-form/application-form.component';
import { PreferencesnewDetailsComponent } from './Pages/preferencesnew-details/preferencesnew-details.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FlatavailableaddComponent } from './Pages/Publishavailabilityflats/flatavailableadd/flatavailableadd.component';
import { FlatavailablelistComponent } from './Pages/Publishavailabilityflats/flatavailablelist/flatavailablelist.component';
import { AllotmentObjectionlistComponent } from './Pages/ObjectionMaster/allotment-objectionlist/allotment-objectionlist.component';
import { FlatAllotmentAddComponent } from './Pages/FlatAvailabilityPublish/flat-allotment-add/flat-allotment-add.component';
import { FlatAllotmentListComponent } from './Pages/FlatAvailabilityPublish/flat-allotment-list/flat-allotment-list.component';
import { ObjectionListTypeWiseComponent } from './Pages/ObjectionMaster/objection-list-type-wise/objection-list-type-wise.component';
import { SenioritylistsmastersComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/senioritylistsmasters/senioritylistsmasters.component';
import { SeniorityaddsmastersComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/seniorityaddsmasters/seniorityaddsmasters.component';
import { CaretakerbuildingmappingsComponent } from './Pages/caretakerbuildingmappings/caretakerbuildingmappings.component';
import { FlatOrderDrawerComponent } from './Pages/QUARTER/flat-order-drawer/flat-order-drawer.component';
import { FlatOrderListComponent } from './Pages/QUARTER/flat-order-list/flat-order-list.component';
import { ObjectionsmasterresolveComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/objectionsmasterresolve/objectionsmasterresolve.component';
import { NotificationlistComponent } from './Pages/notificationlist/notificationlist.component';
import { FinalallotmentaddedmasterComponent } from './Pages/FinalAllotmentlistGenerate/finalallotmentaddedmaster/finalallotmentaddedmaster.component';
import { FinalallotmentlistmasterComponent } from './Pages/FinalAllotmentlistGenerate/finalallotmentlistmaster/finalallotmentlistmaster.component';
import { FinalallotmentobjectionlistComponent } from './Pages/FinalAllotmentlistGenerate/finalallotmentobjectionlist/finalallotmentobjectionlist.component';
import { YoutubevideoslinksComponent } from './Pages/YoutubevideoDrawer/youtubevideoslinks/youtubevideoslinks.component';
import { ShowcardsmisComponent } from './Pages/Mis folder/empoyemis/showcardsmis/showcardsmis.component';
import { ApproveapplicationslistComponent } from './Pages/Mis folder/caretakermis/approveapplicationslist/approveapplicationslist.component';
import { ApproveapplicationsaddComponent } from './Pages/Mis folder/caretakermis/approveapplicationsadd/approveapplicationsadd.component';
import { MISInspectorViewComponent } from './Pages/Mis folder/inspectormis/misinspector-view/misinspector-view.component';
import { EmployeeflatacceptancelistComponent } from './Pages/Mis folder/inspectormis/employeeflatacceptancelist/employeeflatacceptancelist.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { MisdrawerforacceptComponent } from './Pages/Mis folder/empoyemis/misdrawerforaccept/misdrawerforaccept.component';
import { NonacceptanceampComponent } from './Pages/Mis folder/empoyemis/nonacceptanceamp/nonacceptanceamp.component';
import { ChangeflatdrawerComponent } from './Pages/Mis folder/empoyemis/changeflatdrawer/changeflatdrawer.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RostermasterComponent } from './Pages/QUARTER/rostermaster/rostermaster.component';
import { FlatvacantsummaryreportComponent } from './Pages/ReportsFolder/flatvacantsummaryreport/flatvacantsummaryreport.component';
import { FlatvacantdetailsreportComponent } from './Pages/ReportsFolder/flatvacantdetailsreport/flatvacantdetailsreport.component';
import { ApplicationsummaryreportComponent } from './Pages/ReportsFolder/applicationsummaryreport/applicationsummaryreport.component';
import { ApplicationdetailedreportComponent } from './Pages/ReportsFolder/applicationdetailedreport/applicationdetailedreport.component';
import { AllotmentDetailedReportComponent } from './Pages/ReportsFolder/allotment-detailed-report/allotment-detailed-report.component';
import { SeniorityDetailedReportComponent } from './Pages/ReportsFolder/seniority-detailed-report/seniority-detailed-report.component';
import { AllotmentsummaryreportComponent } from './Pages/ReportsFolder/allotmentsummaryreport/allotmentsummaryreport.component';
import { SenioritysummaryreportComponent } from './Pages/ReportsFolder/senioritysummaryreport/senioritysummaryreport.component';
import { PreferenceFilledSummaryReportComponent } from './Pages/ReportsFolder/preference-filled-summary-report/preference-filled-summary-report.component';
import { PreferencefilleddetailsummaryreportComponent } from './Pages/ReportsFolder/preferencefilleddetailsummaryreport/preferencefilleddetailsummaryreport.component';
import { SurrendercaretakerformComponent } from './Pages/Mis folder/caretakermis/surrendercaretakerform/surrendercaretakerform.component';
import { SurrenderforminspectorComponent } from './Pages/Mis folder/inspectormis/surrenderforminspector/surrenderforminspector.component';
import { SurrenderformempComponent } from './Pages/Mis folder/empoyemis/surrenderformemp/surrenderformemp.component';
import { BulkflatvacantcaretakerComponent } from './Pages/QUARTER/bulkflatvacantcaretaker/bulkflatvacantcaretaker.component';
import { BulkflatvacantinspectorComponent } from './Pages/QUARTER/bulkflatvacantinspector/bulkflatvacantinspector.component';
import { AreawiseflatsummarySComponent } from './Pages/ReportsFolder/areawiseflatsummary-s/areawiseflatsummary-s.component';
import { CaretakerwiseflatsummarySComponent } from './Pages/ReportsFolder/caretakerwiseflatsummary-s/caretakerwiseflatsummary-s.component';
import { QuaterAllotementSRComponent } from './Pages/ReportsFolder/quater-allotement-sr/quater-allotement-sr.component';
import { CaretakerwiseFlatDetailedReportComponent } from './Pages/ReportsFolder/caretakerwise-flat-detailed-report/caretakerwise-flat-detailed-report.component';
import { AcceptanceSummaryReportComponent } from './Pages/ReportsFolder/acceptance-summary-report/acceptance-summary-report.component';
import { AcceptanceDetailedReportComponent } from './Pages/ReportsFolder/acceptance-detailed-report/acceptance-detailed-report.component';
import { DeletedapplcationsdetailsComponent } from './Pages/deletedapplcationsdetails/deletedapplcationsdetails.component';
import { SidebarComponent } from './Pages/sidebar/sidebar.component';
import { CurrentOccupationDetailsReportComponent } from './Pages/CurrentOccupationDetails/current-occupation-details-report/current-occupation-details-report.component';
import { ViewVacantFlatListNewFlowComponent } from './Pages/view-vacant-flat-list-new-flow/view-vacant-flat-list-new-flow.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { GrassprofileDetailsUpdateEmpComponent } from './Pages/grassprofile-details-update-emp/grassprofile-details-update-emp.component';
import { GrassfamilyDetailsUpdateEmpComponent } from './Pages/grassfamily-details-update-emp/grassfamily-details-update-emp.component';
import { MIStotaldrawerComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/mistotaldrawer/mistotaldrawer.component';
import { ApplicationcountclickComponent } from './Pages/applicationcountclick/applicationcountclick.component';
import { FlatcountclickComponent } from './Pages/flatcountclick/flatcountclick.component';
import { GraasMainDashboardComponent } from './Pages/graas-main-dashboard/graas-main-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { QuarterApplicationsSummaryReportComponent } from './Pages/NewReports/quarter-applications-summary-report/quarter-applications-summary-report.component';
import { QuarterApplicationsDetailedReportComponent } from './Pages/NewReports/quarter-applications-detailed-report/quarter-applications-detailed-report.component';
import { ResidenceTypewiseQuartersSummaryReportComponent } from './Pages/NewReports/residence-typewise-quarters-summary-report/residence-typewise-quarters-summary-report.component';
import { ResidenceTypewiseQuartersDetailedReportComponent } from './Pages/NewReports/residence-typewise-quarters-detailed-report/residence-typewise-quarters-detailed-report.component';
import { AllotementObjectionDetailedReportComponent } from './Pages/NewReports/allotement-objection-detailed-report/allotement-objection-detailed-report.component';
import { AllotementObjectionSummaryReportComponent } from './Pages/NewReports/allotement-objection-summary-report/allotement-objection-summary-report.component';
import { MonthlyProcessDetailedReportComponent } from './Pages/NewReports/monthly-process-detailed-report/monthly-process-detailed-report.component';
import { MonthlyProcessSummaryReportComponent } from './Pages/NewReports/monthly-process-summary-report/monthly-process-summary-report.component';
import { NewAcceptanceDetailedReportComponent } from './Pages/NewReports/new-acceptance-detailed-report/new-acceptance-detailed-report.component';
import { NewAcceptanceSummaryReportComponent } from './Pages/NewReports/new-acceptance-summary-report/new-acceptance-summary-report.component';
import { PreferancesFilledDetailedReportComponent } from './Pages/NewReports/preferances-filled-detailed-report/preferances-filled-detailed-report.component';
import { PreferancesFilledSummaryReportComponent } from './Pages/NewReports/preferances-filled-summary-report/preferances-filled-summary-report.component';
import { QuartersAllocationDetailedReportComponent } from './Pages/NewReports/quarters-allocation-detailed-report/quarters-allocation-detailed-report.component';
import { QuartersAllocationSummaryReportComponent } from './Pages/NewReports/quarters-allocation-summary-report/quarters-allocation-summary-report.component';
import { SeniorityObjectionDetailedReportComponent } from './Pages/NewReports/seniority-objection-detailed-report/seniority-objection-detailed-report.component';
import { SeniorityObjectionSummaryReportComponent } from './Pages/NewReports/seniority-objection-summary-report/seniority-objection-summary-report.component';
import { ReportsListGraasComponent } from './Pages/NewReports/reports-list-graas/reports-list-graas.component';
import { PayLevelUpgradeListComponent } from './Pages/payLevelUpgrade/pay-level-upgrade-list/pay-level-upgrade-list.component';
import { PayLevelUpgradeFormComponent } from './Pages/payLevelUpgrade/pay-level-upgrade-form/pay-level-upgrade-form.component';
import { RenovationListComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/Renovation/renovation-list/renovation-list.component';
import { UserAreaMappingComponent } from './Pages/UserAreaMapping/user-area-mapping/user-area-mapping.component';
import { UserareamappingdrawerComponent } from './Pages/UserAreaMapping/userareamappingdrawer/userareamappingdrawer.component';
import { RenovationflowListComponent } from './Pages/NewSeniorityListFolder/RenovationFlow/renovationflow-list/renovationflow-list.component';
import { GrassSignatureMasterDrawerComponent } from './Pages/GrassSignatureMaster/grass-signature-master-drawer/grass-signature-master-drawer.component';
import { GrassSignatureMasterListComponent } from './Pages/GrassSignatureMaster/grass-signature-master-list/grass-signature-master-list.component';
import { SurrenderRequestsListComponent } from './Pages/Mis folder/surrenderRequests/surrender-requests-list/surrender-requests-list.component';

@NgModule({
  declarations: [
    GrassComponent,
    Grass1Component,
    LoginComponent,
    DashboardComponent,
    FormComponent,
    FormsComponent,
    RoleComponent,
    RoledetailsComponent,
    RolesComponent,
    UserComponent,
    UsersComponent,
    AddGradPayComponent,
    ListGradPayComponent,
    AddResidenceComponent,
    ListResidenceComponent,
    AddareaComponent,
    ArealistComponent,
    AddCityComponent,
    CityListComponent,
    AddblockmasterComponent,
    BlockmasterlistComponent,
    AddallotmentcheckComponent,
    AllotmentchecklistComponent,
    ListAllotementComponent,
    AddAllotementComponent,
    BuildingDrawerComponent,
    BuildingComponent,
    FloorComponent,
    FloorDrawerComponent,
    QUARTERComponent,
    QuarterDrawerComponent,
    QuarterpendingrequestComponent,
    ShowQuarterPendingdataComponent,
    SenioritylisttableComponent,
    GeneratesenioritylistComponent,
    SenioritylistusersComponent,
    GrassemployeeupdateComponent,
    GrassemployeeloginComponent,
    FlatavailabilityComponent,
    ObjectionlistforInspectorComponent,
    ObjectionhistoryComponent,
    FlatpreferenceaaddComponent,
    ShowinspectorflatprefComponent,
    ApplicationFormAllotmentComponent,
    EmpapplicationviewComponent,
    ShowflatpreftoempComponent,
    GenerateflatpreflistComponent,
    FlatpreflisttableComponent,
    GenerateseniorityaddComponent,
    GeneratesenioritylisttableComponent,
    VacancyComponent,
    NoticeVacantComponent,
    FlatallotmentaddComponent,
    FlatallotmentlistComponent,
    AllotmentFormComponent,
    FlatallotmentuserlistComponent,
    ObjectionsmasterresolveComponent,
    HeaderstepsComponent,
    NewflatAvailableComponent,
    ApplicationMasterComponent,
    PreferencesnewComponent,
    NewscenaoritylistComponent,
    AllotmentdetailsComponent,
    ApplicationFormComponent,
    PreferencesnewDetailsComponent,
    FlatavailableaddComponent,
    FlatavailablelistComponent,
    AllotmentObjectionlistComponent,
    FlatAllotmentAddComponent,
    FlatAllotmentListComponent,
    ObjectionListTypeWiseComponent,
    SenioritylistsmastersComponent,
    SeniorityaddsmastersComponent,
    CaretakerbuildingmappingsComponent,
    FlatOrderListComponent,
    FlatOrderDrawerComponent,
    NotificationlistComponent,
    FinalallotmentobjectionlistComponent,
    FinalallotmentlistmasterComponent,
    FinalallotmentaddedmasterComponent,
    YoutubevideoslinksComponent,
    ShowcardsmisComponent,
    ApproveapplicationslistComponent,
    ApproveapplicationsaddComponent,
    MISInspectorViewComponent,
    EmployeeflatacceptancelistComponent,
    MisdrawerforacceptComponent,
    NonacceptanceampComponent,
    ChangeflatdrawerComponent,
    RostermasterComponent,
    FlatvacantsummaryreportComponent,
    FlatvacantdetailsreportComponent,
    ApplicationsummaryreportComponent,
    ApplicationdetailedreportComponent,
    SeniorityDetailedReportComponent,
    AllotmentDetailedReportComponent,
    SenioritysummaryreportComponent,
    AllotmentsummaryreportComponent,
    PreferenceFilledSummaryReportComponent,
    PreferencefilleddetailsummaryreportComponent,
    SurrenderforminspectorComponent,
    SurrendercaretakerformComponent,
    NonacceptanceampComponent,
    ChangeflatdrawerComponent,
    SurrenderformempComponent,
    BulkflatvacantinspectorComponent,
    BulkflatvacantcaretakerComponent,
    AreawiseflatsummarySComponent,
    CaretakerwiseflatsummarySComponent,
    QuaterAllotementSRComponent,
    // routing
    CaretakerwiseFlatDetailedReportComponent,
    AcceptanceSummaryReportComponent,
    AcceptanceDetailedReportComponent,
    DeletedapplcationsdetailsComponent,
    SidebarComponent,
    CurrentOccupationDetailsReportComponent,
    ViewVacantFlatListNewFlowComponent,
    GrassprofileDetailsUpdateEmpComponent,
    GrassfamilyDetailsUpdateEmpComponent,
    MIStotaldrawerComponent,
    ApplicationcountclickComponent,
    FlatcountclickComponent,
    GraasMainDashboardComponent,
    QuarterApplicationsSummaryReportComponent,
    QuarterApplicationsDetailedReportComponent,
    ResidenceTypewiseQuartersSummaryReportComponent,
    ResidenceTypewiseQuartersDetailedReportComponent,
    QuartersAllocationSummaryReportComponent,
    SeniorityObjectionSummaryReportComponent,
    QuartersAllocationDetailedReportComponent,
    SeniorityObjectionDetailedReportComponent,
    AllotementObjectionSummaryReportComponent,
    AllotementObjectionDetailedReportComponent,
    PreferancesFilledSummaryReportComponent,
    PreferancesFilledDetailedReportComponent,
    MonthlyProcessSummaryReportComponent,
    NewAcceptanceSummaryReportComponent,
    NewAcceptanceDetailedReportComponent,
    MonthlyProcessDetailedReportComponent,
    ReportsListGraasComponent,
    PayLevelUpgradeListComponent,
    PayLevelUpgradeFormComponent,
    RenovationListComponent,
    UserAreaMappingComponent,
    UserareamappingdrawerComponent,
    RenovationflowListComponent,
    GrassSignatureMasterDrawerComponent,
    GrassSignatureMasterListComponent,
    SurrenderRequestsListComponent
  ],
  imports: [
    CommonModule,
    // AngularEditorModule,
    GrassRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    NzEmptyModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzModalModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzMessageModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzStepsModule,
    NzTimePickerModule,
    NzProgressModule,
    NzPopconfirmModule,
    NzBackTopModule,
    NzBadgeModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTabsModule,
    NzTreeModule,
    ReactiveFormsModule,
    NzTimelineModule,
    NgxPrintModule,
    NzCarouselModule,
    DragDropModule,
    NzCardModule,
    NzImageModule,
    AngularEditorModule,
    NgApexchartsModule,
  ],
})
export class GrassModule { }
