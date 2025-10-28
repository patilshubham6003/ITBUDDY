import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrassComponent } from './grass.component';
import { Grass1Component } from './grass1/grass1.component';
import { LoginComponent } from './Pages/CommonModule/login/login.component';
import { DashboardComponent } from './Pages/CommonModule/Dashboard/dashboard/dashboard.component';
import { FormsComponent } from './Pages/CommonModule/Forms/forms/forms.component';
import { RolesComponent } from './Pages/CommonModule/Roles/roles/roles.component';
import { UsersComponent } from './Pages/CommonModule/Users/users/users.component';
import { ListGradPayComponent } from './Pages/GradePayMaster/list-grad-pay/list-grad-pay.component';
import { ListResidenceComponent } from './Pages/ResidenceTypeMaster/list-residence/list-residence.component';
import { CityListComponent } from './Pages/CityMaster/city-list/city-list.component';
import { ArealistComponent } from './Pages/AreaMaster/arealist/arealist.component';
import { BlockmasterlistComponent } from './Pages/BlockMaster/blockmasterlist/blockmasterlist.component';
import { AllotmentchecklistComponent } from './Pages/AllotmentCheckListMaster/allotmentchecklist/allotmentchecklist.component';
import { ListAllotementComponent } from './Pages/AllotementMaster/list-allotement/list-allotement.component';
import { BuildingComponent } from './Pages/BUILDING/building/building.component';
import { FloorComponent } from './Pages/FLOOR/floor/floor.component';
import { QUARTERComponent } from './Pages/QUARTER/quarter/quarter.component';
import { QuarterpendingrequestComponent } from './Pages/AdminQuarterPendingRequest/quarterpendingrequest/quarterpendingrequest.component';
import { ShowinspectorflatprefComponent } from './Pages/FlatpreflistInspector/FlatPrefListInspector/showinspectorflatpref/showinspectorflatpref.component';
import { SenioritylisttableComponent } from './Pages/GenerateSeniorityList/senioritylisttable/senioritylisttable.component';
import { ObjectionlistforInspectorComponent } from './Pages/ObjectionMaster/objectionlistfor-inspector/objectionlistfor-inspector.component';
import { FlatavailabilityComponent } from './Pages/TempRequiredForms/FlatAvailability/flatavailability/flatavailability.component';
import { FlatpreflisttableComponent } from './Pages/GenerateFlatprefflist/flatpreflisttable/flatpreflisttable.component';
import { GeneratesenioritylisttableComponent } from './Pages/GenerateSenioritylistIII/generatesenioritylisttable/generatesenioritylisttable.component';
import { VacancyComponent } from './Pages/GrassForms/vacancy/vacancy.component';
import { FlatallotmentlistComponent } from './Pages/FlatAllotmentMasterFolder/flatallotmentlist/flatallotmentlist.component';
import { HeaderstepsComponent } from './Pages/headersteps/headersteps.component';
import { NewflatAvailableComponent } from './Pages/newflat-available/newflat-available.component';
import { ApplicationMasterComponent } from './Pages/application-master/application-master.component';
import { PreferencesnewComponent } from './Pages/preferencesnew/preferencesnew.component';
import { NewscenaoritylistComponent } from './Pages/newscenaoritylist/newscenaoritylist.component';
import { AllotmentdetailsComponent } from './Pages/allotmentdetails/allotmentdetails.component';
import { FlatavailablelistComponent } from './Pages/Publishavailabilityflats/flatavailablelist/flatavailablelist.component';
import { SenioritylistsmastersComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/senioritylistsmasters/senioritylistsmasters.component';
import { CaretakerbuildingmappingsComponent } from './Pages/caretakerbuildingmappings/caretakerbuildingmappings.component';
import { genertaeSenioritylist } from './Models/GenerateSeniorityList';
import { GeneratesenioritylistComponent } from './Pages/GenerateSeniorityList/generatesenioritylist/generatesenioritylist.component';
import { FlatOrderListComponent } from './Pages/QUARTER/flat-order-list/flat-order-list.component';
import { FinalallotmentlistmasterComponent } from './Pages/FinalAllotmentlistGenerate/finalallotmentlistmaster/finalallotmentlistmaster.component';
import { MISInspectorViewComponent } from './Pages/Mis folder/inspectormis/misinspector-view/misinspector-view.component';
import { ApproveapplicationslistComponent } from './Pages/Mis folder/caretakermis/approveapplicationslist/approveapplicationslist.component';
import { ShowcardsmisComponent } from './Pages/Mis folder/empoyemis/showcardsmis/showcardsmis.component';
import { RostermasterComponent } from './Pages/QUARTER/rostermaster/rostermaster.component';
import { FlatvacantsummaryreportComponent } from './Pages/ReportsFolder/flatvacantsummaryreport/flatvacantsummaryreport.component';
import { ApplicationsummaryreportComponent } from './Pages/ReportsFolder/applicationsummaryreport/applicationsummaryreport.component';
import { ApplicationdetailedreportComponent } from './Pages/ReportsFolder/applicationdetailedreport/applicationdetailedreport.component';
import { FlatvacantdetailsreportComponent } from './Pages/ReportsFolder/flatvacantdetailsreport/flatvacantdetailsreport.component';
import { SeniorityDetailedReportComponent } from './Pages/ReportsFolder/seniority-detailed-report/seniority-detailed-report.component';
import { AllotmentDetailedReportComponent } from './Pages/ReportsFolder/allotment-detailed-report/allotment-detailed-report.component';
import { SenioritysummaryreportComponent } from './Pages/ReportsFolder/senioritysummaryreport/senioritysummaryreport.component';
import { AllotmentsummaryreportComponent } from './Pages/ReportsFolder/allotmentsummaryreport/allotmentsummaryreport.component';
import { PreferenceFilledSummaryReportComponent } from './Pages/ReportsFolder/preference-filled-summary-report/preference-filled-summary-report.component';
import { PreferencefilleddetailsummaryreportComponent } from './Pages/ReportsFolder/preferencefilleddetailsummaryreport/preferencefilleddetailsummaryreport.component';
import { SurrendercaretakerformComponent } from './Pages/Mis folder/caretakermis/surrendercaretakerform/surrendercaretakerform.component';
import { SurrenderforminspectorComponent } from './Pages/Mis folder/inspectormis/surrenderforminspector/surrenderforminspector.component';
import { QuaterAllotementSRComponent } from './Pages/ReportsFolder/quater-allotement-sr/quater-allotement-sr.component';
import { AreawiseflatsummarySComponent } from './Pages/ReportsFolder/areawiseflatsummary-s/areawiseflatsummary-s.component';
import { CaretakerwiseflatsummarySComponent } from './Pages/ReportsFolder/caretakerwiseflatsummary-s/caretakerwiseflatsummary-s.component';
import { AcceptanceDetailedReportComponent } from './Pages/ReportsFolder/acceptance-detailed-report/acceptance-detailed-report.component';
import { AcceptanceSummaryReportComponent } from './Pages/ReportsFolder/acceptance-summary-report/acceptance-summary-report.component';
import { CaretakerwiseFlatDetailedReportComponent } from './Pages/ReportsFolder/caretakerwise-flat-detailed-report/caretakerwise-flat-detailed-report.component';
import { DeletedapplcationsdetailsComponent } from './Pages/deletedapplcationsdetails/deletedapplcationsdetails.component';
import { CurrentOccupationDetailsReportComponent } from './Pages/CurrentOccupationDetails/current-occupation-details-report/current-occupation-details-report.component';
import { GraasMainDashboardComponent } from './Pages/graas-main-dashboard/graas-main-dashboard.component';
import { QuarterApplicationsSummaryReportComponent } from './Pages/NewReports/quarter-applications-summary-report/quarter-applications-summary-report.component';
import { QuarterApplicationsDetailedReportComponent } from './Pages/NewReports/quarter-applications-detailed-report/quarter-applications-detailed-report.component';
import { ResidenceTypewiseQuartersSummaryReportComponent } from './Pages/NewReports/residence-typewise-quarters-summary-report/residence-typewise-quarters-summary-report.component';
import { ResidenceTypewiseQuartersDetailedReportComponent } from './Pages/NewReports/residence-typewise-quarters-detailed-report/residence-typewise-quarters-detailed-report.component';
import { AllotementObjectionDetailedReportComponent } from './Pages/NewReports/allotement-objection-detailed-report/allotement-objection-detailed-report.component';
import { AllotementObjectionSummaryReportComponent } from './Pages/NewReports/allotement-objection-summary-report/allotement-objection-summary-report.component';
import { QuartersAllocationDetailedReportComponent } from './Pages/NewReports/quarters-allocation-detailed-report/quarters-allocation-detailed-report.component';
import { QuartersAllocationSummaryReportComponent } from './Pages/NewReports/quarters-allocation-summary-report/quarters-allocation-summary-report.component';
import { SeniorityObjectionDetailedReportComponent } from './Pages/NewReports/seniority-objection-detailed-report/seniority-objection-detailed-report.component';
import { SeniorityObjectionSummaryReportComponent } from './Pages/NewReports/seniority-objection-summary-report/seniority-objection-summary-report.component';
import { MonthlyProcessSummaryReportComponent } from './Pages/NewReports/monthly-process-summary-report/monthly-process-summary-report.component';
import { NewAcceptanceDetailedReportComponent } from './Pages/NewReports/new-acceptance-detailed-report/new-acceptance-detailed-report.component';
import { NewAcceptanceSummaryReportComponent } from './Pages/NewReports/new-acceptance-summary-report/new-acceptance-summary-report.component';
import { PreferancesFilledDetailedReportComponent } from './Pages/NewReports/preferances-filled-detailed-report/preferances-filled-detailed-report.component';
import { PreferancesFilledSummaryReportComponent } from './Pages/NewReports/preferances-filled-summary-report/preferances-filled-summary-report.component';
import { MonthlyProcessDetailedReportComponent } from './Pages/NewReports/monthly-process-detailed-report/monthly-process-detailed-report.component';
import { ReportsListGraasComponent } from './Pages/NewReports/reports-list-graas/reports-list-graas.component';
import { PayLevelUpgradeListComponent } from './Pages/payLevelUpgrade/pay-level-upgrade-list/pay-level-upgrade-list.component';
import { RenovationListComponent } from './Pages/NewSeniorityListFolder/SeniorityListMaster/Renovation/renovation-list/renovation-list.component';
import { UserAreaMappingComponent } from './Pages/UserAreaMapping/user-area-mapping/user-area-mapping.component';
import { RenovationflowListComponent } from './Pages/NewSeniorityListFolder/RenovationFlow/renovationflow-list/renovationflow-list.component';
import { GrassSignatureMasterListComponent } from './Pages/GrassSignatureMaster/grass-signature-master-list/grass-signature-master-list.component';
import { SurrenderRequestsListComponent } from './Pages/Mis folder/surrenderRequests/surrender-requests-list/surrender-requests-list.component';

const routes: Routes = [
  {
    path: '',
    component: GrassComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'graas_dashboard' },
      { path: 'graas_dashboard', component: GraasMainDashboardComponent },
      { path: 'grass-dashboard', component: DashboardComponent },
      { path: 'forms', component: FormsComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'CityMaster', component: CityListComponent },
      { path: 'AreaMaster', component: ArealistComponent },
      { path: 'BlockMaster', component: BlockmasterlistComponent },
      { path: 'AllotmentCheckList', component: AllotmentchecklistComponent },
      { path: 'GradePayMaster', component: ListGradPayComponent },
      { path: 'ResedenceMaster', component: ListResidenceComponent },
      { path: 'AllotementMaster', component: ListAllotementComponent },
      { path: 'BuildingMaster', component: BuildingComponent },
      { path: 'FloorMaster', component: FloorComponent },
      { path: 'QuarterMaster', component: QUARTERComponent },
      {
        path: 'QuartersPendingRequestList',
        component: QuarterpendingrequestComponent,
      },
      { path: 'Senioritylist', component: SenioritylistsmastersComponent },

      { path: 'FlatAvailability', component: FlatavailabilityComponent },
      {
        path: 'SeniorityListObjections',
        component: ObjectionlistforInspectorComponent,
      },
      {
        path: 'ShowFlatPreferenceList',
        component: ShowinspectorflatprefComponent,
      },
      {
        path: 'SenioritylistChange',
        component: GeneratesenioritylisttableComponent,
      },
      { path: 'VacancyComponent', component: VacancyComponent },
      {
        path: 'FlatAllotmentMaster',
        component: FinalallotmentlistmasterComponent,
      },

      { path: 'ng', component: HeaderstepsComponent },
      { path: 'flatAvailabecompo', component: NewflatAvailableComponent },
      // { path: 'Applicationcompo', component: ApplicationMasterComponent },
      {
        path: 'accomodation_allotment_process',
        component: ApplicationMasterComponent,
      },

      { path: 'Preferencescompo', component: PreferencesnewComponent },
      { path: 'Senioritylistcomp', component: NewscenaoritylistComponent },
      { path: 'Allotmentcompo', component: AllotmentdetailsComponent },
      {
        path: 'publishedFlatAvailabilitylist',
        component: FlatavailablelistComponent,
      },
      {
        path: 'caretakerbilding',
        component: CaretakerbuildingmappingsComponent,
      },
      { path: 'flatOrderList', component: FlatOrderListComponent },
      { path: 'rostermaster', component: RostermasterComponent },
      { path: 'WaitingList', component: FlatpreflisttableComponent },
      { path: 'WaitingList', component: FlatpreflisttableComponent },
      { path: 'misinspectorview', component: MISInspectorViewComponent },
      {
        path: 'misflatacceptance',
        component: ApproveapplicationslistComponent,
      },
      // { path: 'flatOrderList', component: FlatOrderListComponent },
      { path: 'mis', component: ShowcardsmisComponent },
      {
        path: 'flatvacantsummaryreport',
        component: FlatvacantsummaryreportComponent,
      },
      {
        path: 'applicationsummaryreport',
        component: ApplicationsummaryreportComponent,
      },
      {
        path: 'applicationdetailedreport',
        component: ApplicationdetailedreportComponent,
      },
      {
        path: 'flatvacantdetailedreport',
        component: FlatvacantdetailsreportComponent,
      },
      {
        path: 'senioritydetailedreport',
        component: SeniorityDetailedReportComponent,
      },
      {
        path: 'allotmentdetailedreport',
        component: AllotmentDetailedReportComponent,
      },
      {
        path: 'senioritysummaryreport',
        component: SenioritysummaryreportComponent,
      },
      {
        path: 'allotmentsummaryreport',
        component: AllotmentsummaryreportComponent,
      },
      {
        path: 'preferencefilledsummaryreport',
        component: PreferenceFilledSummaryReportComponent,
      },
      {
        path: 'Preferencefilleddetailsummaryreport',
        component: PreferencefilleddetailsummaryreportComponent,
      },
      {
        path: 'flatsurrendercaretaker',
        component: SurrendercaretakerformComponent,
      },
      {
        path: 'flatsurrenderinspector',
        component: SurrenderforminspectorComponent,
      },
      {
        path: 'caretaker_wise_flat_summary_report',
        component: CaretakerwiseflatsummarySComponent,
      },
      {
        path: 'area_wise_flat_summary_report',
        component: AreawiseflatsummarySComponent,
      },
      {
        path: 'quater_allotement_report',
        component: QuaterAllotementSRComponent,
      },
      {
        path: 'CaretakerwiseFlatDetailedReport',
        component: CaretakerwiseFlatDetailedReportComponent,
      },
      {
        path: 'AcceptanceSummaryReport',
        component: AcceptanceSummaryReportComponent,
      },
      {
        path: 'AcceptanceDetailedReport',
        component: AcceptanceDetailedReportComponent,
      },
      {
        path: 'deletedapplicationrequest',
        component: DeletedapplcationsdetailsComponent,
      },
      {
        path: 'current-occupation-detailed-report',
        component: CurrentOccupationDetailsReportComponent,
      },
      {
        path: 'allotment_objection_detailed_report',
        component: AllotementObjectionDetailedReportComponent,
      },
      {
        path: 'allotment_objections_summary_report',
        component: AllotementObjectionSummaryReportComponent,
      },
      {
        path: 'monthly_process_detailed_report',
        component: MonthlyProcessDetailedReportComponent,
      },
      {
        path: 'monthly_process_summary_report',
        component: MonthlyProcessSummaryReportComponent,
      },
      {
        path: 'acceptance_detailed_report',
        component: NewAcceptanceDetailedReportComponent,
      },
      {
        path: 'acceptance_summary_report',
        component: NewAcceptanceSummaryReportComponent,
      },
      {
        path: 'filled_preferences_detailed_report',
        component: PreferancesFilledDetailedReportComponent,
      },
      {
        path: 'filled_preferences_summary_report',
        component: PreferancesFilledSummaryReportComponent,
      },
      {
        path: 'quarter-applications-detailed-report',
        component: QuarterApplicationsDetailedReportComponent,
      },
      {
        path: 'quarter-applications-summary-report',
        component: QuarterApplicationsSummaryReportComponent,
      },
      {
        path: 'quarter_allocation_detailed_report',
        component: QuartersAllocationDetailedReportComponent,
      },
      {
        path: 'quarter_allocations_summary_report',
        component: QuartersAllocationSummaryReportComponent,
      },
      {
        path: 'residence-typewise-quarters-detailed-report',
        component: ResidenceTypewiseQuartersDetailedReportComponent,
      },
      {
        path: 'residence-typewise-quarters-summary-report',
        component: ResidenceTypewiseQuartersSummaryReportComponent,
      },
      {
        path: 'seniority_objection_detailed_report',
        component: SeniorityObjectionDetailedReportComponent,
      },
      {
        path: 'seniority_objections_summary_report',
        component: SeniorityObjectionSummaryReportComponent,
      },
      { path: 'reports_list', component: ReportsListGraasComponent },
      {
        path: 'employee-upgrade-details',
        component: PayLevelUpgradeListComponent,
      },
      { path: 'renovation-requests', component: RenovationListComponent },
      { path: 'user-area-mapping', component: UserAreaMappingComponent },
      { path: 'manage-renovation-requests', component: RenovationflowListComponent },
      {
        path: 'graas_signature_master',
        component: GrassSignatureMasterListComponent,
      },
      {
        path: 'quarter-surrender-requests',
        component: SurrenderRequestsListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrassRoutingModule { }
