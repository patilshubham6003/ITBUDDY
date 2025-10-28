import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MedicalComponent } from './medical.component';
import { MedicalRoutingModule } from './medical-routing.module';
// import { FormComponent } from '../Admin/forms and roles/Forms/form/form.component';
// import { FormsComponent } from '../Admin/forms and roles/Forms/forms/forms.component';
// import { RoleComponent } from '../Admin/forms and roles/Roles/role/role.component';
// import { RoledetailsComponent } from '../Admin/forms and roles/Roles/roledetails/roledetails.component';
// import { RolesComponent } from '../Admin/forms and roles/Roles/roles/roles.component';
// import { UserComponent } from '../Admin/forms and roles/user/user/user.component';
// import { UsersComponent } from '../Admin/forms and roles/user/users/users.component';
import { ListPendingClaimComponent } from './LTC Module/LTCMaster/LTCPendingClaim/list-pending-claim/list-pending-claim.component';
import { AddltcmasterComponent } from './LTC Module/LTCMaster/addltcmaster/addltcmaster.component';
import { LtcmasterlistComponent } from './LTC Module/LTCMaster/ltcmasterlist/ltcmasterlist.component';
import { CalculationComponent } from './LTC Module/PrintDocument/calculation/calculation.component';
import { GoltcComponent } from './LTC Module/PrintDocument/goltc/goltc.component';
import { LeaveTravelConcessionBillComponent } from './LTC Module/PrintDocument/leave-travel-concession-bill/leave-travel-concession-bill.component';
import { LtcsanstionorderComponent } from './LTC Module/PrintDocument/ltcsanstionorder/ltcsanstionorder.component';
import { Ltcsheet1Component } from './LTC Module/PrintDocument/ltcsheet1/ltcsheet1.component';
import { Ltcsheet2Component } from './LTC Module/PrintDocument/ltcsheet2/ltcsheet2.component';
import { NatureComponent } from './LTC Module/PrintDocument/nature/nature.component';
import { DetailsofjourneyComponent } from './LTC Module/detailsofjourney/detailsofjourney.component';
import { ParticularsofjourneyComponent } from './LTC Module/particularsofjourney/particularsofjourney.component';
import { PlacesconnectedbyrailComponent } from './LTC Module/placesconnectedbyrail/placesconnectedbyrail.component';
import { CityDrawerComponent } from './Master Forms/City/city-drawer/city-drawer.component';
import { CityMasterComponent } from './Master Forms/City/city-master/city-master.component';
import { EmployeetouraddComponent } from './Master Forms/Employee/employeeTour/employeetouradd/employeetouradd.component';
import { EmployeetourlistComponent } from './Master Forms/Employee/employeeTour/employeetourlist/employeetourlist.component';
import { EmployeeaddComponent } from './Master Forms/Employee/employeeadd/employeeadd.component';
import { EmployeeclaimaddComponent } from './Master Forms/Employee/employeeclaimadd/employeeclaimadd.component';
import { EmployeeclaimlistComponent } from './Master Forms/Employee/employeeclaimlist/employeeclaimlist.component';
import { EmployeelistComponent } from './Master Forms/Employee/employeelist/employeelist.component';
import { EmployeeltclistComponent } from './Master Forms/Employee/employeeltc/employeeltclist/employeeltclist.component';
import { LtcemployeeaddComponent } from './Master Forms/Employee/employeeltc/ltcemployeeadd/ltcemployeeadd.component';
import { EmployeetransferaddComponent } from './Master Forms/Employee/employeetransfer/employeetransferadd/employeetransferadd.component';
import { EmployeetransferlistComponent } from './Master Forms/Employee/employeetransfer/employeetransferlist/employeetransferlist.component';
import { AddnewfileformComponent } from './Master Forms/FilesMaster/addnewfileform/addnewfileform.component';
import { FilemastertableComponent } from './Master Forms/FilesMaster/filemastertable/filemastertable.component';
import { FilehierarchiesComponent } from './Master Forms/FilesMaster/filemodule/filehierarchies/filehierarchies.component';
import { FilehierarchyComponent } from './Master Forms/FilesMaster/filemodule/filehierarchy/filehierarchy.component';
import { ViewlogsComponent } from './Master Forms/FilesMaster/viewlogs/viewlogs.component';
import { AddhospitalmasterComponent } from './Master Forms/HospitalMaster/addhospitalmaster/addhospitalmaster.component';
import { HospitalmasterlistComponent } from './Master Forms/HospitalMaster/hospitalmasterlist/hospitalmasterlist.component';
import { AddtinvestigationComponent } from './Master Forms/Investigation-procedure/addtinvestigation/addtinvestigation.component';
import { ListinvestigationComponent } from './Master Forms/Investigation-procedure/listinvestigation/listinvestigation.component';
import { InvestigationComponentComponent } from './Master Forms/InvestigationCategory/investigation-component/investigation-component.component';
import { InvestigationDrawerComponent } from './Master Forms/InvestigationCategory/investigation-drawer/investigation-drawer.component';
import { AddMedicalFacilityComponent } from './Master Forms/MedicalFacility/add-medical-facility/add-medical-facility.component';
import { MedicalFacilitiesMasterComponent } from './Master Forms/MedicalFacility/medical-facilities-master/medical-facilities-master.component';
import { NotificationAndMemorandomDrawerComponent } from './Master Forms/NotificationAndMemorandom/notification-and-memorandom-drawer/notification-and-memorandom-drawer.component';
import { NotificationAndMemorandomMasterComponent } from './Master Forms/NotificationAndMemorandom/notification-and-memorandom-master/notification-and-memorandom-master.component';
import { AddsignaturemasterComponent } from './Master Forms/SignatureMaster/addsignaturemaster/addsignaturemaster.component';
import { SignaturemasterlistComponent } from './Master Forms/SignatureMaster/signaturemasterlist/signaturemasterlist.component';
import { AdddatabasetablemasterComponent } from './Master Forms/databasetablemaster/adddatabasetablemaster/adddatabasetablemaster.component';
import { DatabasetablemasterlistComponent } from './Master Forms/databasetablemaster/databasetablemasterlist/databasetablemasterlist.component';
import { InfoComponent } from './Master Forms/info/info.component';
import { OfficeaddComponent } from './Master Forms/officemaster/officeadd/officeadd.component';
import { OfficelistComponent } from './Master Forms/officemaster/officelist/officelist.component';
import { TravelclassaddComponent } from './Master Forms/travelclassmaster/travelclassadd/travelclassadd.component';
import { TravelclasslistComponent } from './Master Forms/travelclassmaster/travelclasslist/travelclasslist.component';
import { TraveladdComponent } from './Master Forms/travelmaster/traveladd/traveladd.component';
import { TravellistComponent } from './Master Forms/travelmaster/travellist/travellist.component';
import { AddInvestigationMasterRevisedComponent } from './Medical Module/Claim/add-investigation-master-revised/add-investigation-master-revised.component';
// import { AddInvestigationMasterComponent } from './Medical Module/Claim/add-investigation-master/add-investigation-master.component';
// import { ApplyclaimComponent } from './Medical Module/Claim/applyclaim/applyclaim.component';
import { ClaimLogDrawerComponent } from './Medical Module/Claim/claim-log-drawer/claim-log-drawer.component';
// import { ClaimUpdatedComponent } from './Medical Module/Claim/claim-updated/claim-updated.component';
import { ClaimsComponent } from './Medical Module/Claim/claims/claims.component';
import { ClaimApplicationDrawerComponent } from './Medical Module/ClaimApplication/claim-application-drawer/claim-application-drawer.component';
// import { ClaimApplicationMasterComponent } from './Medical Module/ClaimApplication/claim-application-master/claim-application-master.component';
import { AddclaimstagesComponent } from './Medical Module/ClaimStagesMaster/addclaimstages/addclaimstages.component';
import { ClaimstageslistComponent } from './Medical Module/ClaimStagesMaster/claimstageslist/claimstageslist.component';
import { AddforwardmasterComponent } from './Medical Module/ForwardMaster/addforwardmaster/addforwardmaster.component';
import { ForwardmasterlistComponent } from './Medical Module/ForwardMaster/forwardmasterlist/forwardmasterlist.component';
import { DelaycondolenceorderComponent } from './Medical Module/OrderDrawers/delaycondolenceorder/delaycondolenceorder.component';
import { DelaycondolencepermissionComponent } from './Medical Module/OrderDrawers/delaycondolencepermission/delaycondolencepermission.component';
import { RefexpoorderComponent } from './Medical Module/OrderDrawers/refexpoorder/refexpoorder.component';
import { RefexpopermissionComponent } from './Medical Module/OrderDrawers/refexpopermission/refexpopermission.component';
import { RefhodorderComponent } from './Medical Module/OrderDrawers/refhodorder/refhodorder.component';
import { RefhodpermissionComponent } from './Medical Module/OrderDrawers/refhodpermission/refhodpermission.component';
import { AdddelaycondolationComponent } from './Medical Module/PermissionMaster/DelayCondolationMaster/adddelaycondolation/adddelaycondolation.component';
import { DelaycondolationlistComponent } from './Medical Module/PermissionMaster/DelayCondolationMaster/delaycondolationlist/delaycondolationlist.component';
import { DelayletterComponent } from './Medical Module/PermissionMaster/DelayCondolationMaster/delayletter/delayletter.component';
import { DelayorderComponent } from './Medical Module/PermissionMaster/DelayCondolationMaster/delayorder/delayorder.component';
import { AddexpostfactoComponent } from './Medical Module/PermissionMaster/ExpostFactoMaster/addexpostfacto/addexpostfacto.component';
import { ExpostfactolistComponent } from './Medical Module/PermissionMaster/ExpostFactoMaster/expostfactolist/expostfactolist.component';
import { ExpostletterComponent } from './Medical Module/PermissionMaster/ExpostFactoMaster/expostletter/expostletter.component';
import { ExpostorderComponent } from './Medical Module/PermissionMaster/ExpostFactoMaster/expostorder/expostorder.component';
import { AddgeneratedelaycondonationComponent } from './Medical Module/PermissionMaster/GeneratePermission/DelayCondonation/addgeneratedelaycondonation/addgeneratedelaycondonation.component';
import { GeneratedelaycondonationlistComponent } from './Medical Module/PermissionMaster/GeneratePermission/DelayCondonation/generatedelaycondonationlist/generatedelaycondonationlist.component';
import { AddgenerateexpostfactoComponent } from './Medical Module/PermissionMaster/GeneratePermission/ExpostFacto/addgenerateexpostfacto/addgenerateexpostfacto.component';
import { GenerateexpostfactolistComponent } from './Medical Module/PermissionMaster/GeneratePermission/ExpostFacto/generateexpostfactolist/generateexpostfactolist.component';
import { AddgeneratehodComponent } from './Medical Module/PermissionMaster/GeneratePermission/HOD/addgeneratehod/addgeneratehod.component';
import { GeneratehodlistComponent } from './Medical Module/PermissionMaster/GeneratePermission/HOD/generatehodlist/generatehodlist.component';
import { AddHODPermissionComponent } from './Medical Module/PermissionMaster/HODPermissionMaster/add-hodpermission/add-hodpermission.component';
import { HodletterComponent } from './Medical Module/PermissionMaster/HODPermissionMaster/hodletter/hodletter.component';
import { HodorderComponent } from './Medical Module/PermissionMaster/HODPermissionMaster/hodorder/hodorder.component';
import { HODPermissionlistComponent } from './Medical Module/PermissionMaster/HODPermissionMaster/hodpermissionlist/hodpermissionlist.component';
import { AddclaimemployeeComponent } from './Medical Module/addclaimemployee/addclaimemployee.component';
import { AddclaimmasterComponent } from './Medical Module/addclaimmaster/addclaimmaster.component';
import { ClaimcertificateComponent } from './Medical Module/claimcertificate/claimcertificate.component';
// import { ClaimmasterlistComponent } from './Medical Module/claimmasterlist/ClaimmasterlistComponent';
import { GAR23Component } from './Medical Module/gar23/gar23.component';
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
import { AdvancedAmountJourneyDetailComponent } from './Reports/Transfer Reports/advanced-amount-journey-detail/advanced-amount-journey-detail.component';
import { DateWiseModeWiseCountComponent } from './Reports/Transfer Reports/date-wise-mode-wise-count/date-wise-mode-wise-count.component';
import { EmployeeWiseDetailedReportComponent } from './Reports/Transfer Reports/employee-wise-detailed-report/employee-wise-detailed-report.component';
import { InspectorWiseTransferSummaryReportComponent } from './Reports/Transfer Reports/inspector-wise-transfer-summary-report/inspector-wise-transfer-summary-report.component';
import { ModeWiseAmountStatComponent } from './Reports/Transfer Reports/mode-wise-amount-stat/mode-wise-amount-stat.component';
import { ModeWiseClassWiseCountComponent } from './Reports/Transfer Reports/mode-wise-class-wise-count/mode-wise-class-wise-count.component';
import { MonthWiseTransferCountReportComponent } from './Reports/Transfer Reports/month-wise-transfer-count-report/month-wise-transfer-count-report.component';
import { TransferreddetailedreportComponent } from './Reports/Transfer Reports/transferreddetailedreport/transferreddetailedreport.component';
import { ReportsviewComponent } from './Reports/reportsview/reportsview.component';
import { AaykarbhvanComponent } from './Tour Module/Print Tour/aaykarbhvan/aaykarbhvan.component';
import { AdheshorderComponent } from './Tour Module/Print Tour/adheshorder/adheshorder.component';
import { BillsectionComponent } from './Tour Module/Print Tour/billsection/billsection.component';
import { CertificateduplicateComponent } from './Tour Module/Print Tour/certificateduplicate/certificateduplicate.component';
import { ChecklistComponent } from './Tour Module/Print Tour/checklist/checklist.component';
import { PartAComponent } from './Tour Module/Print Tour/part-a/part-a.component';
import { PlacealongsideComponent } from './Tour Module/Print Tour/placealongside/placealongside.component';
import { SelfDeclarationCertificateComponent } from './Tour Module/Print Tour/self-declaration-certificate/self-declaration-certificate.component';
import { TourPartBComponent } from './Tour Module/Print Tour/tour-part-b/tour-part-b.component';
import { ToursantionorderComponent } from './Tour Module/Print Tour/toursantionorder/toursantionorder.component';
import { TravellingallouncebillComponent } from './Tour Module/Print Tour/travellingallouncebill/travellingallouncebill.component';
import { AddtourmasterComponent } from './Tour Module/TourMaster/addtourmaster/addtourmaster.component';
import { PendingtourclaimsComponent } from './Tour Module/TourMaster/pendingtourclaims/pendingtourclaims.component';
import { TourmasterlistComponent } from './Tour Module/TourMaster/tourmasterlist/tourmasterlist.component';
import { CitytourComponent } from './Tour Module/citytour/citytour.component';
import { DetailsandpurposetourComponent } from './Tour Module/detailsandpurposetour/detailsandpurposetour.component';
import { JourneyparticularcityComponent } from './Tour Module/journeyparticularcity/journeyparticularcity.component';
import { JourneyparticulartoursComponent } from './Tour Module/journeyparticulartours/journeyparticulartours.component';
import { TourfoodbilladdComponent } from './Tour Module/tourfoodbilladd/tourfoodbilladd.component';
import { TourparticularhotelsComponent } from './Tour Module/tourparticularhotels/tourparticularhotels.component';
import { AddComponent } from './Transfer Module/Transfer print/add/add.component';
import { CertificateComponent } from './Transfer Module/Transfer print/certificate/certificate.component';
import { OrderFormComponent } from './Transfer Module/Transfer print/order-form/order-form.component';
import { TransferchecklistComponent } from './Transfer Module/Transfer print/transferchecklist/transferchecklist.component';
import { TravelingAllowanceComponent } from './Transfer Module/Transfer print/traveling-allowance/traveling-allowance.component';
import { TransferPendingClaimComponent } from './Transfer Module/Transfer/transfer-pending-claim/transfer-pending-claim.component';
import { TransferaddComponent } from './Transfer Module/Transfer/transferadd/transferadd.component';
import { TransferlistComponent } from './Transfer Module/Transfer/transferlist/transferlist.component';
import { DetailsjorneyComponent } from './Transfer Module/detailsjorney/detailsjorney.component';
import { DetailsjourneyperfomedbyrailComponent } from './Transfer Module/detailsjourneyperfomedbyrail/detailsjourneyperfomedbyrail.component';
import { Form1Component } from './Transfer Module/form1/form1.component';
import { Form2Component } from './Transfer Module/form2/form2.component';
import { Form3Component } from './Transfer Module/form3/form3.component';
import { TransportationchargesofpersonaleffectsComponent } from './Transfer Module/transportationchargesofpersonaleffects/transportationchargesofpersonaleffects.component';
import { DashboardComponent } from './pages/CommonModule/Dashboard/dashboard/dashboard.component';
import { AdmindashboardComponent } from './pages/CommonModule/admindashboard/admindashboard.component';
import { LTCdashboardComponent } from './pages/CommonModule/ltcdashboard/ltcdashboard.component';
import { TourdashboardComponent } from './pages/CommonModule/tourdashboard/tourdashboard.component';
import { TrasferdashboardComponent } from './pages/CommonModule/trasferdashboard/trasferdashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AppRoutingModule } from '../app-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EmployeeupdateComponent } from './employeeupdate/employeeupdate.component';
import { CommonDashboardComponent } from './NewChanges/common-dashboard/common-dashboard.component';
import { EmployeeLtcListComponent } from './NewChanges/LTC Changes/employee-ltc-list/employee-ltc-list.component';
import { EmployeeTourListComponent } from './NewChanges/Tour Changes/employee-tour-list/employee-tour-list.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { MedicalChangesComponent } from './NewChanges/Medical Changes/medical-changes/medical-changes.component';
import { TransferChangesComponent } from './NewChanges/Transfer Changes/transfer-changes/transfer-changes.component';
import { LTCHelpComponent } from './NewChanges/Help/ltchelp/ltchelp.component';
import { MedicalHelpComponent } from './NewChanges/Help/medical-help/medical-help.component';
import { TourHelpComponent } from './NewChanges/Help/tour-help/tour-help.component';
import { TransferHelpComponent } from './NewChanges/Help/transfer-help/transfer-help.component';
import { NgxPrintModule } from 'ngx-print';
import { BlockyearlistComponent } from './LTC Module/LTCMaster/BlockYearMaster/blockyearlist/blockyearlist.component';
import { AddblockyearComponent } from './LTC Module/LTCMaster/BlockYearMaster/addblockyear/addblockyear.component';
import { LTCemployeeUpdateComponent } from './Master Forms/Employee/employeeProfileCompletion/LTCemployeeUpdate/ltcemployee-update/ltcemployee-update.component';
import { MedicalEmployeeUpdateComponent } from './Master Forms/Employee/employeeProfileCompletion/MedicalEmployeeUpdate/medical-employee-update/medical-employee-update.component';
import { TourEmployeeUpdateComponent } from './Master Forms/Employee/employeeProfileCompletion/TOURemployeeUpdate/tour-employee-update/tour-employee-update.component';
import { TransferEmployeeUpdateComponent } from './Master Forms/Employee/employeeProfileCompletion/TransferEmployeeUpdate/transfer-employee-update/transfer-employee-update.component';
import { DDOTypeDetailsListComponent } from './Master Forms/ddoTypeDetails/ddotype-details-list/ddotype-details-list.component';
import { DDOTypeListComponent } from './Master Forms/DDOTypeMaster/ddotype-list/ddotype-list.component';
import { ListdesignationComponent } from './Master Forms/designation/listdesignation/listdesignation.component';
import { DDOTypeAddComponent } from './Master Forms/DDOTypeMaster/ddotype-add/ddotype-add.component';
import { DDOTypeDetailsAddComponent } from './Master Forms/ddoTypeDetails/ddotype-details-add/ddotype-details-add.component';
import { AdddesignationComponent } from './Master Forms/designation/adddesignation/adddesignation.component';
import { AdvanceAnnexureComponent } from './Medical Module/Claim/advance-annexure/advance-annexure.component';
import { AdvanceorderltcComponent } from './Master Forms/Employee/employeeltc/advanceorderltc/advanceorderltc.component';
import { AdvanceddrawerComponent } from './Tour Module/Print Tour/advanceddrawer/advanceddrawer.component';
import { ManjuriaadeshdrawerComponent } from './Tour Module/Print Tour/manjuriaadeshdrawer/manjuriaadeshdrawer.component';
import { ShorttermbilldrwaerComponent } from './Tour Module/Print Tour/shorttermbilldrwaer/shorttermbilldrwaer.component';
import { ApplicationdrawerComponent } from './Tour Module/Print Tour/applicationdrawer/applicationdrawer.component';
import { ApplicationForGrantTransferAdvComponent } from './Transfer Module/Transfer print/application-for-grant-transfer-adv/application-for-grant-transfer-adv.component';
import { ApprovaldrawerComponent } from './Transfer Module/Transfer print/approvaldrawer/approvaldrawer.component';
import { GotatradvComponent } from './Transfer Module/Transfer print/gotatradv/gotatradv.component';
import { TATRDocumentdrawerComponent } from './Transfer Module/Transfer print/tatr-documentdrawer/tatr-documentdrawer.component';
import { ApplicationDrawerComponent } from './LTC Module/PrintDocument/application-drawer/application-drawer.component';
import { CalculationDrawerComponent } from './LTC Module/PrintDocument/calculation-drawer/calculation-drawer.component';
import { GARDrawerComponent } from './LTC Module/PrintDocument/gardrawer/gardrawer.component';
import { GpbIIltcAdvdrawerComponent } from './LTC Module/PrintDocument/gpb-iiltc-advdrawer/gpb-iiltc-advdrawer.component';
import { ManjuriaadeshltsDrwaerComponent } from './LTC Module/PrintDocument/manjuriaadeshlts-drwaer/manjuriaadeshlts-drwaer.component';
import { LtcmasteradvancelistComponent } from './LTC Module/LTCMaster/ltcmasteradvancelist/ltcmasteradvancelist.component';
import { ClaimmasterlistadvanceComponent } from './Medical Module/claimmasterlistadvance/claimmasterlistadvance.component';
import { TransferlistadvanceComponent } from './Transfer Module/Transfer/transferlistadvance/transferlistadvance.component';
import { TourmasterlistadvanceComponent } from './Tour Module/TourMaster/tourmasterlistadvance/tourmasterlistadvance.component';
import { DdoMassterlistComponent } from './Master Forms/ddoMaster/ddo-massterlist/ddo-massterlist.component';
import { AddddoMassterComponent } from './Master Forms/ddoMaster/addddo-masster/addddo-masster.component';
import { ManagesignlistComponent } from './managesignature/managesignlist/managesignlist.component';
import { ManagesigneditComponent } from './managesignature/managesignedit/managesignedit.component';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ClaimmasterlistComponent } from './Medical Module/claimmasterlist/claimmasterlist.component';
import { MedicalDdoWiseClaimSummaryComponent } from './Reports/Medical Reports/medical-ddo-wise-claim-summary/medical-ddo-wise-claim-summary.component';
import { MedicalDdoWiseClaimDetailedComponent } from './Reports/Medical Reports/medical-ddo-wise-claim-detailed/medical-ddo-wise-claim-detailed.component';
import { LtcDdoWiseClaimSummaryComponent } from './Reports/LTC Reports/ltc-ddo-wise-claim-summary/ltc-ddo-wise-claim-summary.component';
import { LtcDdoWiseClaimDetailedComponent } from './Reports/LTC Reports/ltc-ddo-wise-claim-detailed/ltc-ddo-wise-claim-detailed.component';
import { TourDdoWiseClaimSummaryComponent } from './Reports/Tour Reports/tour-ddo-wise-claim-summary/tour-ddo-wise-claim-summary.component';
import { TourDdoWiseClaimDetailedComponent } from './Reports/Tour Reports/tour-ddo-wise-claim-detailed/tour-ddo-wise-claim-detailed.component';
import { TransferDdoWiseClaimSummaryComponent } from './Reports/Transfer Reports/transfer-ddo-wise-claim-summary/transfer-ddo-wise-claim-summary.component';
import { TransferDdoWiseClaimDetailedComponent } from './Reports/Transfer Reports/transfer-ddo-wise-claim-detailed/transfer-ddo-wise-claim-detailed.component';
import { DdoWiseSignatureSummaryComponent } from './Reports/Other Reports/ddo-wise-signature-summary/ddo-wise-signature-summary.component';
import { DdoWiseSignatureDetailedReportComponent } from './Reports/Other Reports/ddo-wise-signature-detailed-report/ddo-wise-signature-detailed-report.component';
import { MedicalEmployeeFamilyNewComponent } from './pages/CommonModule/medical-employee-family-new/medical-employee-family-new.component';
import { MedicalEmployeeProfileNewComponent } from './pages/CommonModule/medical-employee-profile-new/medical-employee-profile-new.component';

// import { ListdesignationComponent } from './Medical/Master Forms/designation/listdesignation/listdesignation.component';
// import { DDOTypeListComponent } from './Medical/Master Forms/DDOTypeMaster/ddotype-list/ddotype-list.component';
// import { DDOTypeDetailsListComponent } from './Medical/Master Forms/ddoTypeDetails/ddotype-details-list/ddotype-details-list.component';
@NgModule({
  declarations: [
    MedicalComponent,
    // ExportDirective,
    // FormsComponent,
    // FormComponent,
    // RolesComponent,
    // RoleComponent,
    // RoledetailsComponent,
    // UsersComponent,
    // UserComponent,
    // LoginComponent,
    AdmindashboardComponent,

    // ClientMasterComponent,
    // ClientDrawerComponent,

    // ProjectMasterComponent,
    // ProjectDrawerComponent,
    // ProjectMappingComponent,

    // ModuleMasterComponent,
    // ModuleDrawerComponent,
    // ModuleMappingComponent,

    // FeatureMasterComponent,
    // FeatureDrawerComponent,
    // FeatureMappingComponent,

    // ModuleFeatureViewComponent,
    // FeatureViewComponent,

    // CategoryMasterComponent,
    // CategoryDrawerComponent,

    // TaskMasterComponent,
    // TaskDrawerComponent,
    // TaskSubtaskMappingComponent,

    // TaskTransferHistoryComponent,
    // TaskTransferDrawerComponent,

    // AttachmentMasterComponent,
    // AttachmentDrawerComponent,

    // WorklogComponent,
    // WorklogDrawerComponent,

    // AssigneeMappingComponent,

    // CommentComponent,
    // CommentDrawerComponent,

    // TypeMasterComponent,
    // TypeDrawerComponent,

    // KanbanComponent,
    // KanbanProjectWiseComponent,
    // RoadmapComponent,

    // SecondToHoursPipe,
    DashboardComponent,

    HospitalmasterlistComponent,
    AddhospitalmasterComponent,
    CityMasterComponent,
    CityDrawerComponent,
    NotificationAndMemorandomMasterComponent,
    NotificationAndMemorandomDrawerComponent,
    ListinvestigationComponent,
    AddtinvestigationComponent,
    AddMedicalFacilityComponent,
    MedicalFacilitiesMasterComponent,
    InvestigationComponentComponent,
    InvestigationDrawerComponent,
    // ClaimApplicationMasterComponent,
    ClaimApplicationDrawerComponent,
    ClaimstageslistComponent,
    AddclaimstagesComponent,
    ClaimsComponent,
    // ApplyclaimComponent,
    // AddInvestigationMasterComponent,
    ClaimLogDrawerComponent,
    // ClaimUpdatedComponent,
    AddInvestigationMasterRevisedComponent,
    // EmployeeaddComponent,
    // EmployeelistComponent
    EmployeelistComponent,
    EmployeeaddComponent,
    ClaimmasterlistComponent,
    AddclaimmasterComponent,
    ImportExcelInvestigationRateComponent,
    DatabasetablemasterlistComponent,
    AdddatabasetablemasterComponent,
    HospitalWiseSummaryReportComponent,
    InspectorWiseAmountStatsReportComponent,
    InspectorWiseDetailedSummaryReportComponent,
    InspectorWiseSummaryReportComponent,
    StageWiseSummaryReportComponent,
    // EmployeeloginComponent,
    EmployeeupdateComponent,
    AddnewfileformComponent,
    FilemastertableComponent,
    FilehierarchyComponent,
    FilehierarchiesComponent,
    ViewlogsComponent,
    HispitalWiseAmountStatsComponent,
    BeneficiaryTypeAmountStatsComponent,
    EmployeewisedetailedComponent,
    EmployeeWiseSummaryReportComponent,
    EmployeeWiseAmountStatsComponent,
    BeneficiaryTypeWiseDetailedComponent,
    BeneficiaryTypeSummaryReportsComponent,
    EmployeeclaimlistComponent,
    EmployeeclaimaddComponent,
    AddclaimemployeeComponent,
    UserWiseFilesDetailedReportComponent,
    UserWiseFilesSummaryReportComponent,
    PendingClaimsComponent,
    HierarchyWiseFilesSummaryReportComponent,
    UserfileactivitydetailedreportComponent,
    DayWiseFilesSummaryReportComponent,
    UserWiseFilesClosureDetailedReportComponent,
    HospitalwisedetailedComponent,
    AddforwardmasterComponent,
    ForwardmasterlistComponent,
    FilesystemdashboardComponent,
    ReportsviewComponent,
    SignaturemasterlistComponent,
    AddsignaturemasterComponent,
    InfoComponent,
    RefexpoorderComponent,
    RefexpopermissionComponent,
    RefhodorderComponent,
    RefhodpermissionComponent,
    DelaycondolenceorderComponent,
    DelaycondolencepermissionComponent,
    TravellistComponent,
    TraveladdComponent,
    TravelclasslistComponent,
    TravelclassaddComponent,
    TransferlistComponent,
    TransferaddComponent,
    OfficelistComponent,
    OfficeaddComponent,
    Form3Component,
    Form2Component,
    Form1Component,
    DetailsjorneyComponent,
    AddHODPermissionComponent,
    HODPermissionlistComponent,
    AdddelaycondolationComponent,
    DelaycondolationlistComponent,
    AddexpostfactoComponent,
    ExpostfactolistComponent,
    TravelingAllowanceComponent,
    OrderFormComponent,
    CertificateComponent,
    AddComponent,
    DetailsjourneyperfomedbyrailComponent,
    TransportationchargesofpersonaleffectsComponent,
    AddltcmasterComponent,
    LtcmasterlistComponent,
    DetailsofjourneyComponent,
    ParticularsofjourneyComponent,
    PlacesconnectedbyrailComponent,
    AddgeneratedelaycondonationComponent,
    GeneratedelaycondonationlistComponent,
    GenerateexpostfactolistComponent,
    AddgeneratehodComponent,
    GeneratehodlistComponent,
    Ltcsheet2Component,
    Ltcsheet1Component,
    LtcsanstionorderComponent,
    GoltcComponent,
    CalculationComponent,
    LeaveTravelConcessionBillComponent,
    NatureComponent,
    GAR23Component,
    ClaimcertificateComponent,
    AddgenerateexpostfactoComponent,
    DelayorderComponent,
    DelayletterComponent,
    ExpostorderComponent,
    ExpostletterComponent,
    HodorderComponent,
    HodletterComponent,
    TourmasterlistComponent,
    AddtourmasterComponent,
    TourparticularhotelsComponent,
    CitytourComponent,
    DetailsandpurposetourComponent,
    JourneyparticularcityComponent,
    JourneyparticulartoursComponent,
    AaykarbhvanComponent,
    AdheshorderComponent,
    BillsectionComponent,
    CertificateduplicateComponent,
    ChecklistComponent,
    TravellingallouncebillComponent,
    ToursantionorderComponent,
    TourPartBComponent,
    SelfDeclarationCertificateComponent,
    PlacealongsideComponent,
    PartAComponent,
    InspectorWiseTransferSummaryReportComponent,
    InspectorWiseTourSummaryReportComponent,
    InspectorWiseLtcSummaryReportComponent,
    ClaimMasterReportComponent,
    TransferchecklistComponent,
    TransferreddetailedreportComponent,
    LtcdetailedreportComponent,
    TourdetailedreportsComponent,
    AdvancedAmountJourneyDetailComponent,
    DateWiseModeWiseCountComponent,
    EmployeeWiseDetailedReportComponent,
    ModeWiseAmountStatComponent,
    ModeWiseClassWiseCountComponent,
    LTCdashboardComponent,
    TourdashboardComponent,
    TrasferdashboardComponent,
    MonthWiseClaimCountltcComponent,
    ModeWiseClassWiseLtcCountltcComponent,
    EmployeeWiseLtcDetailedReportltcComponent,
    DateWiseModeWiseJourneyCountltcComponent,
    AdvanceGivenForJourneyltcComponent,
    MonthWiseTransferCountReportComponent,
    EmployeetouraddComponent,
    EmployeetourlistComponent,
    EmployeeltclistComponent,
    LtcemployeeaddComponent,
    PendingtourclaimsComponent,
    ListPendingClaimComponent,
    TransferPendingClaimComponent,
    EmployeetransferaddComponent,
    EmployeetransferlistComponent,
    TourfoodbilladdComponent,
    CommonDashboardComponent,
    EmployeeLtcListComponent,
    EmployeeTourListComponent,
    TransferChangesComponent,
    MedicalChangesComponent,
    LTCHelpComponent,
    MedicalHelpComponent,
    TourHelpComponent,
    TransferHelpComponent,
    BlockyearlistComponent,
    AddblockyearComponent,
    TransferEmployeeUpdateComponent,
    TourEmployeeUpdateComponent,
    LTCemployeeUpdateComponent,
    MedicalEmployeeUpdateComponent,
    ListdesignationComponent,
    DDOTypeListComponent,
    DDOTypeDetailsListComponent,
    AdddesignationComponent,
    DDOTypeAddComponent,
    DDOTypeDetailsAddComponent,
    AdvanceAnnexureComponent,
    AdvanceorderltcComponent,
    AdvanceddrawerComponent,
    ManjuriaadeshdrawerComponent,
    ShorttermbilldrwaerComponent,
    ApplicationdrawerComponent,
    TATRDocumentdrawerComponent,
    GotatradvComponent,
    ApprovaldrawerComponent,
    ApplicationForGrantTransferAdvComponent,
    AdvanceorderltcComponent,
    GpbIIltcAdvdrawerComponent,
    CalculationDrawerComponent,
    ApplicationDrawerComponent,
    GARDrawerComponent,
    ManjuriaadeshltsDrwaerComponent,
    LtcmasteradvancelistComponent,
    ClaimmasterlistadvanceComponent,
    TransferlistadvanceComponent,
    TourmasterlistadvanceComponent,
    DdoMassterlistComponent,
    AddddoMassterComponent,
    ManagesignlistComponent,
    ManagesigneditComponent,
    MedicalDdoWiseClaimSummaryComponent,
    MedicalDdoWiseClaimDetailedComponent,
    LtcDdoWiseClaimSummaryComponent,
    LtcDdoWiseClaimDetailedComponent,
    TourDdoWiseClaimSummaryComponent,
    TourDdoWiseClaimDetailedComponent,
    TransferDdoWiseClaimSummaryComponent,
    TransferDdoWiseClaimDetailedComponent,
    DdoWiseSignatureSummaryComponent,
    DdoWiseSignatureDetailedReportComponent,
    MedicalEmployeeProfileNewComponent,
    MedicalEmployeeFamilyNewComponent,
  ],
  imports: [
    CommonModule,
    MedicalRoutingModule,
    NgApexchartsModule,
    // CommonModule,
    AngularEditorModule,
    MedicalRoutingModule,
    // IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    NzPaginationModule,
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
    // Ng2SearchPipeModule,
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
    // NgApexchartsModule,
    NzMessageModule,
    NzBadgeModule,
    NzStepsModule,
    NzCardModule,
    NzCommentModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzTimePickerModule,
    // NgIdleKeepaliveModule.forRoot(),
    NzProgressModule,
    NzPopconfirmModule,
    NzBackTopModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTabsModule,
    NzTreeModule,
    DatePipe,
    NgxPrintModule,
    NzTimelineModule,
    NzImageModule,
  ],
  providers: [NzNotificationService],
})
export class MedicalModule {}
