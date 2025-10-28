import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalComponent } from './medical.component';
// import { FormsComponent } from '../Admin/forms and roles/Forms/forms/forms.component';
// import { RolesComponent } from '../Admin/forms and roles/Roles/roles/roles.component';
// import { UsersComponent } from '../Admin/forms and roles/user/users/users.component';
import { ListPendingClaimComponent } from './LTC Module/LTCMaster/LTCPendingClaim/list-pending-claim/list-pending-claim.component';
import { LtcmasterlistComponent } from './LTC Module/LTCMaster/ltcmasterlist/ltcmasterlist.component';
import { CityMasterComponent } from './Master Forms/City/city-master/city-master.component';
import { EmployeetourlistComponent } from './Master Forms/Employee/employeeTour/employeetourlist/employeetourlist.component';
import { EmployeeclaimlistComponent } from './Master Forms/Employee/employeeclaimlist/employeeclaimlist.component';
import { EmployeelistComponent } from './Master Forms/Employee/employeelist/employeelist.component';
import { EmployeeltclistComponent } from './Master Forms/Employee/employeeltc/employeeltclist/employeeltclist.component';
import { EmployeetransferlistComponent } from './Master Forms/Employee/employeetransfer/employeetransferlist/employeetransferlist.component';
import { FilemastertableComponent } from './Master Forms/FilesMaster/filemastertable/filemastertable.component';
import { FilehierarchyComponent } from './Master Forms/FilesMaster/filemodule/filehierarchy/filehierarchy.component';
import { HospitalmasterlistComponent } from './Master Forms/HospitalMaster/hospitalmasterlist/hospitalmasterlist.component';
import { ListinvestigationComponent } from './Master Forms/Investigation-procedure/listinvestigation/listinvestigation.component';
import { InvestigationComponentComponent } from './Master Forms/InvestigationCategory/investigation-component/investigation-component.component';
import { MedicalFacilitiesMasterComponent } from './Master Forms/MedicalFacility/medical-facilities-master/medical-facilities-master.component';
import { NotificationAndMemorandomMasterComponent } from './Master Forms/NotificationAndMemorandom/notification-and-memorandom-master/notification-and-memorandom-master.component';
import { SignaturemasterlistComponent } from './Master Forms/SignatureMaster/signaturemasterlist/signaturemasterlist.component';
import { DatabasetablemasterlistComponent } from './Master Forms/databasetablemaster/databasetablemasterlist/databasetablemasterlist.component';
import { InfoComponent } from './Master Forms/info/info.component';
import { TravelclasslistComponent } from './Master Forms/travelclassmaster/travelclasslist/travelclasslist.component';
import { TravellistComponent } from './Master Forms/travelmaster/travellist/travellist.component';
// import { ClaimUpdatedComponent } from './Medical Module/Claim/claim-updated/claim-updated.component';
import { ClaimsComponent } from './Medical Module/Claim/claims/claims.component';
import { ClaimstageslistComponent } from './Medical Module/ClaimStagesMaster/claimstageslist/claimstageslist.component';
import { ForwardmasterlistComponent } from './Medical Module/ForwardMaster/forwardmasterlist/forwardmasterlist.component';
import { DelaycondolationlistComponent } from './Medical Module/PermissionMaster/DelayCondolationMaster/delaycondolationlist/delaycondolationlist.component';
import { ExpostfactolistComponent } from './Medical Module/PermissionMaster/ExpostFactoMaster/expostfactolist/expostfactolist.component';
import { HODPermissionlistComponent } from './Medical Module/PermissionMaster/HODPermissionMaster/hodpermissionlist/hodpermissionlist.component';
// import { ClaimmasterlistComponent } from './Medical Module/claimmasterlist/ClaimmasterlistComponent';
import { ImportExcelInvestigationRateComponent } from './Medical Module/import-excel-investigation-rate/import-excel-investigation-rate.component';
import { PendingClaimsComponent } from './Medical Module/pending-claims/pending-claims.component';
import { AdvanceGivenForJourneyltcComponent } from './Reports/LTC Reports/advance-given-for-journeyltc/advance-given-for-journeyltc.component';
import { DateWiseModeWiseJourneyCountltcComponent } from './Reports/LTC Reports/date-wise-mode-wise-journey-countltc/date-wise-mode-wise-journey-countltc.component';
import { EmployeeWiseLtcDetailedReportltcComponent } from './Reports/LTC Reports/employee-wise-ltc-detailed-reportltc/employee-wise-ltc-detailed-reportltc.component';
import { InspectorWiseLtcSummaryReportComponent } from './Reports/LTC Reports/inspector-wise-ltc-summary-report/inspector-wise-ltc-summary-report.component';
import { LtcdetailedreportComponent } from './Reports/LTC Reports/ltcdetailedreport/ltcdetailedreport.component';
import { ModeWiseClassWiseLtcCountltcComponent } from './Reports/LTC Reports/mode-wise-class-wise-ltc-countltc/mode-wise-class-wise-ltc-countltc.component';
import { MonthWiseClaimCountltcComponent } from './Reports/LTC Reports/month-wise-claim-countltc/month-wise-claim-countltc.component';
import { BeneficiaryTypeAmountStatsComponent } from './Reports/Medical Reports/beneficiary-type-amount-stats/beneficiary-type-amount-stats.component';
import { BeneficiaryTypeSummaryReportsComponent } from './Reports/Medical Reports/beneficiary-type-summary-reports/beneficiary-type-summary-reports.component';
import { BeneficiaryTypeWiseDetailedComponent } from './Reports/Medical Reports/beneficiary-type-wise-detailed/beneficiary-type-wise-detailed.component';
import { ClaimMasterReportComponent } from './Reports/Medical Reports/claim-master-report/claim-master-report.component';
import { DayWiseFilesSummaryReportComponent } from './Reports/Medical Reports/day-wise-files-summary-report/day-wise-files-summary-report.component';
import { EmployeeWiseAmountStatsComponent } from './Reports/Medical Reports/employee-wise-amount-stats/employee-wise-amount-stats.component';
import { EmployeeWiseSummaryReportComponent } from './Reports/Medical Reports/employee-wise-summary-report/employee-wise-summary-report.component';
import { EmployeewisedetailedComponent } from './Reports/Medical Reports/employeewisedetailed/employeewisedetailed.component';
import { FilesystemdashboardComponent } from './Reports/Medical Reports/filesystemdashboard/filesystemdashboard.component';
import { HierarchyWiseFilesSummaryReportComponent } from './Reports/Medical Reports/hierarchy-wise-files-summary-report/hierarchy-wise-files-summary-report.component';
import { HispitalWiseAmountStatsComponent } from './Reports/Medical Reports/hospital-wise-amount-stats/hispital-wise-amount-stats.component';
import { HospitalWiseSummaryReportComponent } from './Reports/Medical Reports/hospital-wise-summary-report/hospital-wise-summary-report.component';
import { HospitalwisedetailedComponent } from './Reports/Medical Reports/hospitalwisedetailed/hospitalwisedetailed.component';
import { InspectorWiseAmountStatsReportComponent } from './Reports/Medical Reports/inspector-wise-amount-stats-report/inspector-wise-amount-stats-report.component';
import { InspectorWiseDetailedSummaryReportComponent } from './Reports/Medical Reports/inspector-wise-detailed-summary-report/inspector-wise-detailed-summary-report.component';
import { InspectorWiseSummaryReportComponent } from './Reports/Medical Reports/inspector-wise-summary-report/inspector-wise-summary-report.component';
import { StageWiseSummaryReportComponent } from './Reports/Medical Reports/stage-wise-summary-report/stage-wise-summary-report.component';
import { UserWiseFilesClosureDetailedReportComponent } from './Reports/Medical Reports/user-wise-files-closure-detailed-report/user-wise-files-closure-detailed-report.component';
import { UserWiseFilesDetailedReportComponent } from './Reports/Medical Reports/user-wise-files-detailed-report/user-wise-files-detailed-report.component';
import { UserWiseFilesSummaryReportComponent } from './Reports/Medical Reports/user-wise-files-summary-report/user-wise-files-summary-report.component';
import { UserfileactivitydetailedreportComponent } from './Reports/Medical Reports/userfileactivitydetailedreport/userfileactivitydetailedreport.component';
import { InspectorWiseTourSummaryReportComponent } from './Reports/Tour Reports/inspector-wise-tour-summary-report/inspector-wise-tour-summary-report.component';
import { TourdetailedreportsComponent } from './Reports/Tour Reports/tourdetailedreports/tourdetailedreports.component';
import { InspectorWiseTransferSummaryReportComponent } from './Reports/Transfer Reports/inspector-wise-transfer-summary-report/inspector-wise-transfer-summary-report.component';
import { TransferreddetailedreportComponent } from './Reports/Transfer Reports/transferreddetailedreport/transferreddetailedreport.component';
import { ReportsviewComponent } from './Reports/reportsview/reportsview.component';
import { PendingtourclaimsComponent } from './Tour Module/TourMaster/pendingtourclaims/pendingtourclaims.component';
import { TourmasterlistComponent } from './Tour Module/TourMaster/tourmasterlist/tourmasterlist.component';
import { TransferPendingClaimComponent } from './Transfer Module/Transfer/transfer-pending-claim/transfer-pending-claim.component';
import { TransferlistComponent } from './Transfer Module/Transfer/transferlist/transferlist.component';
import { DashboardComponent } from './pages/CommonModule/Dashboard/dashboard/dashboard.component';
import { AdmindashboardComponent } from './pages/CommonModule/admindashboard/admindashboard.component';
import { LTCdashboardComponent } from './pages/CommonModule/ltcdashboard/ltcdashboard.component';
import { TourdashboardComponent } from './pages/CommonModule/tourdashboard/tourdashboard.component';
import { TrasferdashboardComponent } from './pages/CommonModule/trasferdashboard/trasferdashboard.component';
import { CommonDashboardComponent } from './NewChanges/common-dashboard/common-dashboard.component';
import { EmployeeLtcListComponent } from './NewChanges/LTC Changes/employee-ltc-list/employee-ltc-list.component';
import { EmployeeTourListComponent } from './NewChanges/Tour Changes/employee-tour-list/employee-tour-list.component';
import { TransferChangesComponent } from './NewChanges/Transfer Changes/transfer-changes/transfer-changes.component';
import { MedicalChangesComponent } from './NewChanges/Medical Changes/medical-changes/medical-changes.component';
import { BlockyearlistComponent } from './LTC Module/LTCMaster/BlockYearMaster/blockyearlist/blockyearlist.component';
import { DDOTypeListComponent } from './Master Forms/DDOTypeMaster/ddotype-list/ddotype-list.component';
import { DDOTypeDetailsListComponent } from './Master Forms/ddoTypeDetails/ddotype-details-list/ddotype-details-list.component';
import { ListdesignationComponent } from './Master Forms/designation/listdesignation/listdesignation.component';
import { LtcmasteradvancelistComponent } from './LTC Module/LTCMaster/ltcmasteradvancelist/ltcmasteradvancelist.component';
import { TransferlistadvanceComponent } from './Transfer Module/Transfer/transferlistadvance/transferlistadvance.component';
import { TourmasterlistadvanceComponent } from './Tour Module/TourMaster/tourmasterlistadvance/tourmasterlistadvance.component';
import { DdoMassterlistComponent } from './Master Forms/ddoMaster/ddo-massterlist/ddo-massterlist.component';
import { ClaimmasterlistadvanceComponent } from './Medical Module/claimmasterlistadvance/claimmasterlistadvance.component';
import { ManagesignlistComponent } from './managesignature/managesignlist/managesignlist.component';
import { ClaimmasterlistComponent } from './Medical Module/claimmasterlist/claimmasterlist.component';
import { MedicalDdoWiseClaimSummaryComponent } from './Reports/Medical Reports/medical-ddo-wise-claim-summary/medical-ddo-wise-claim-summary.component';
import { MedicalDdoWiseClaimDetailedComponent } from './Reports/Medical Reports/medical-ddo-wise-claim-detailed/medical-ddo-wise-claim-detailed.component';
import { TourDdoWiseClaimSummaryComponent } from './Reports/Tour Reports/tour-ddo-wise-claim-summary/tour-ddo-wise-claim-summary.component';
import { TransferDdoWiseClaimSummaryComponent } from './Reports/Transfer Reports/transfer-ddo-wise-claim-summary/transfer-ddo-wise-claim-summary.component';
import { DdoWiseSignatureSummaryComponent } from './Reports/Other Reports/ddo-wise-signature-summary/ddo-wise-signature-summary.component';
import { DdoWiseSignatureDetailedReportComponent } from './Reports/Other Reports/ddo-wise-signature-detailed-report/ddo-wise-signature-detailed-report.component';
import { LtcDdoWiseClaimDetailedComponent } from './Reports/LTC Reports/ltc-ddo-wise-claim-detailed/ltc-ddo-wise-claim-detailed.component';
import { TourDdoWiseClaimDetailedComponent } from './Reports/Tour Reports/tour-ddo-wise-claim-detailed/tour-ddo-wise-claim-detailed.component';
import { TransferDdoWiseClaimDetailedComponent } from './Reports/Transfer Reports/transfer-ddo-wise-claim-detailed/transfer-ddo-wise-claim-detailed.component';
import { LtcDdoWiseClaimSummaryComponent } from './Reports/LTC Reports/ltc-ddo-wise-claim-summary/ltc-ddo-wise-claim-summary.component';
// import { Medical1Component } from './medical1/medical1.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalComponent,
    children: [
      // { path: 'medical1', component: Medical1Component}
      // { path: 'login', component: LoginComponent },
      // { path: 'forms', component: FormsComponent },
      // { path: 'users', component: UsersComponent },
      // { path: 'roles', component: RolesComponent },
      { path: 'index', component: AdmindashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'hospital-master', component: HospitalmasterlistComponent },
      { path: 'city-master', component: CityMasterComponent },
      {
        path: 'notification-memorandum-master',
        component: NotificationAndMemorandomMasterComponent,
      },
      {
        path: 'investigation-procedure-master',
        component: ListinvestigationComponent,
      },
      {
        path: 'medical-facility-master',
        component: MedicalFacilitiesMasterComponent,
      },
      {
        path: 'investigation-procedure-categories',
        component: InvestigationComponentComponent,
      },
      { path: 'claim-application', component: ClaimsComponent },
      { path: 'claim-stages-master', component: ClaimstageslistComponent },
      // { path: 'claim-application-revised', component: ClaimUpdatedComponent },
      { path: 'admin-dashboard', component: AdmindashboardComponent },
      { path: 'employee', component: EmployeelistComponent },
      { path: 'claimmaster', component: ClaimmasterlistComponent },
      {
        path: 'advanceclaimmaster',
        component: ClaimmasterlistadvanceComponent,
      },
      { path: 'databaseexcel', component: DatabasetablemasterlistComponent },
      { path: 'importexcel', component: ImportExcelInvestigationRateComponent },
      // { path: 'hospitalReport', component: HospitalWiseSummaryReportComponent },
      { path: 'fileHierarchy', component: FilehierarchyComponent },
      { path: 'fileMaster', component: FilemastertableComponent },
      // { path: 'employeelogin', component: EmployeeloginComponent },
      { path: 'employeeclaimmaster', component: MedicalChangesComponent },
      // { path: 'employeeclaimmaster', component: EmployeeclaimlistComponent },
      { path: 'pendingclaims', component: PendingClaimsComponent },
      { path: 'forwardmaster', component: ForwardmasterlistComponent },
      { path: 'reportview', component: ReportsviewComponent },

      { path: 'signaturemaster', component: SignaturemasterlistComponent },
      { path: 'aboutInfo', component: InfoComponent },
      { path: 'transfermaster', component: TransferlistComponent },
      {
        path: 'transfermasteradvance',
        component: TransferlistadvanceComponent,
      },
      { path: 'hodpermissionmaster', component: HODPermissionlistComponent },
      { path: 'expostfactomaster', component: ExpostfactolistComponent },
      {
        path: 'delaycondolationmaster',
        component: DelaycondolationlistComponent,
      },
      { path: 'ltcmaster', component: LtcmasterlistComponent },
      { path: 'ltcmasteradvance', component: LtcmasteradvancelistComponent },
      { path: 'travelclassmaster', component: TravelclasslistComponent },
      { path: 'travelmaster', component: TravellistComponent },
      { path: 'tourmaster', component: TourmasterlistComponent },
      { path: 'tourmasteradvance', component: TourmasterlistadvanceComponent },
      {
        path: 'ltcdarshboard',
        component: LTCdashboardComponent,
      },
      {
        path: 'tourdarshboard',
        component: TourdashboardComponent,
      },
      {
        path: 'transferdarshboard',
        component: TrasferdashboardComponent,
      },
      {
        path: 'employeetour',
        component: EmployeeTourListComponent,
      },
      // {
      //   path: 'employeetour',
      //   component: EmployeetourlistComponent,
      // },
      {
        path: 'employeeltcmaster',
        component: EmployeeLtcListComponent,
      },
      // {
      //   path: 'employeeltcmaster',
      //   component: EmployeeltclistComponent,
      // },
      {
        path: 'pendingtourclaims',
        component: PendingtourclaimsComponent,
      },
      {
        path: 'pendingltcclaims',
        component: ListPendingClaimComponent,
      },
      {
        path: 'pendingtransferclaims',
        component: TransferPendingClaimComponent,
      },
      {
        path: 'employeetransfer',
        component: TransferChangesComponent,
      },
      // {
      //   path: 'employeetransfer',
      //   component: EmployeetransferlistComponent,
      // },

      //// reports ////
      // { path: 'hospitalwiseamountreport', component: HispitalWiseAmountStatsComponent },
      {
        path: 'beneficiarytypeamount',
        component: BeneficiaryTypeAmountStatsComponent,
      },
      {
        path: 'beneficiarytypesummary',
        component: BeneficiaryTypeSummaryReportsComponent,
      },
      {
        path: 'beneficiarytypedeailed',
        component: BeneficiaryTypeWiseDetailedComponent,
      },
      {
        path: 'employeewiseamountstats',
        component: EmployeeWiseAmountStatsComponent,
      },
      {
        path: 'employeewisesummary',
        component: EmployeeWiseSummaryReportComponent,
      },
      {
        path: 'inspectorSummaryReport',
        component: InspectorWiseSummaryReportComponent,
      },
      {
        path: 'inspectorDailyDetailedReport',
        component: InspectorWiseDetailedSummaryReportComponent,
      },
      {
        path: 'hostpitalwisesummary',
        component: HospitalWiseSummaryReportComponent,
      },
      { path: 'stageReport', component: StageWiseSummaryReportComponent },
      {
        path: 'inspectorAmountReport',
        component: InspectorWiseAmountStatsReportComponent,
      },
      {
        path: 'hostpitalwiseamounts',
        component: HispitalWiseAmountStatsComponent,
      },
      { path: 'employeewisedetail', component: EmployeewisedetailedComponent },
      {
        path: 'userwisefiledetail',
        component: UserWiseFilesDetailedReportComponent,
      },
      {
        path: 'hospitalwisedetailed',
        component: HospitalwisedetailedComponent,
      },
      {
        path: 'userwisefilecloserdetail',
        component: UserWiseFilesClosureDetailedReportComponent,
      },
      {
        path: 'daywisefilesummary',
        component: DayWiseFilesSummaryReportComponent,
      },
      {
        path: 'userfileactivitydetail',
        component: UserfileactivitydetailedreportComponent,
      },
      {
        path: 'hierarchywisefilesummary',
        component: HierarchyWiseFilesSummaryReportComponent,
      },
      { path: 'filesystemdashboard', component: FilesystemdashboardComponent },
      {
        path: 'userwisefilesummary',
        component: UserWiseFilesSummaryReportComponent,
      },
      {
        path: 'claimcountreport',
        component: ClaimMasterReportComponent,
      },
      {
        path: 'ltcdetailreport',
        component: LtcdetailedreportComponent,
      },
      {
        path: 'inspectorwiseltcsummary',
        component: InspectorWiseLtcSummaryReportComponent,
      },
      {
        path: 'inspectorwisetoursummary',
        component: InspectorWiseTourSummaryReportComponent,
      },
      {
        path: 'inspectorwisetransfersummary',
        component: InspectorWiseTransferSummaryReportComponent,
      },
      {
        path: 'transferdetailreport',
        component: TransferreddetailedreportComponent,
      },
      {
        path: 'tourdetailreport',
        component: TourdetailedreportsComponent,
      },
      {
        path: 'advanceGivenForLtcJorney',
        component: AdvanceGivenForJourneyltcComponent,
      },
      {
        path: 'dateWiseModeWiseJourneyCount',
        component: DateWiseModeWiseJourneyCountltcComponent,
      },
      {
        path: 'employeewiseltcdetailed',
        component: EmployeeWiseLtcDetailedReportltcComponent,
      },
      {
        path: 'modewiseclasswiseltccount',
        component: ModeWiseClassWiseLtcCountltcComponent,
      },
      {
        path: 'monthwiseltcclaimcount',
        component: MonthWiseClaimCountltcComponent,
      },
      {
        path: 'commondashboard',
        component: CommonDashboardComponent,
      },
      // {
      //   path: 'employee-ltc-list',
      //   component: EmployeeLtcListComponent,
      // },
      // {
      //   path: 'employee-tour-list',
      //   component: EmployeeTourListComponent,
      // },
      {
        path: 'ltctourtransferdashboard',
        component: CommonDashboardComponent,
      },
      {
        path: 'blockyear',
        component: BlockyearlistComponent,
      },
      {
        path: 'Listdesignation',
        component: ListdesignationComponent,
      },
      {
        path: 'DDOTypeList',
        component: DDOTypeListComponent,
      },
      {
        path: 'DDOTypeDetailsList',
        component: DDOTypeDetailsListComponent,
      },
      {
        path: 'DDOMasterList',
        component: DdoMassterlistComponent,
      },
      {
        path: 'map_signature',
        component: ManagesignlistComponent,
      },
      {
        path: 'ddo_wise_medical_detailed_report',
        component: MedicalDdoWiseClaimDetailedComponent,
      },
      {
        path: 'ddo_wise_medical_summary_report',
        component: MedicalDdoWiseClaimSummaryComponent,
      },
      {
        path: 'ddo_wise_ltc_detailed_report',
        component: LtcDdoWiseClaimDetailedComponent,
      },
      {
        path: 'ddo_wise_ltc_summary_report',
        component: LtcDdoWiseClaimSummaryComponent,
      },
      {
        path: 'ddo_wise_detailed_signature_report',
        component: DdoWiseSignatureDetailedReportComponent,
      },
      {
        path: 'ddo_wise_signature_summary_report',
        component: DdoWiseSignatureSummaryComponent,
      },
      {
        path: 'ddo_wise_tour_claim_detailed_report',
        component: TourDdoWiseClaimDetailedComponent,
      },
      {
        path: 'ddo_wise_tour_claim_summary_report',
        component: TourDdoWiseClaimSummaryComponent,
      },
      {
        path: 'ddo_wise_transfer_claim_detailed_report',
        component: TransferDdoWiseClaimDetailedComponent,
      },
      {
        path: 'ddo_wise_transfer_claim_summary_report',
        component: TransferDdoWiseClaimSummaryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalRoutingModule {}
