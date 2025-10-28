export class EmployeeQuarterFormsMaster {
  ID: any = 0;
  EMPLOYEE_NAME: any;
  EMPLOYEE_CODE: any;
  EMAIL_ID: any;
  CLIENT_ID: any = 1;
  MOBILE_NO: any;
  CIVIL_LIST: any;
  DESIGNATION_ID: number = 0;
  JOINING_DATE: any;
  PRESENT_PAY_LEVEL_DATE: any;
  GRAD_PAY_LEVEL_ID: any;
  DATE_OF_PRIORITY: any;
  RETIREMENT_DATE: any;
  DOB: any;
  GENDER: any = 'Male';
  CHECK_CONDITION: any = '1';
  BASIC_PAY: any;
  BUILDING_ID: number = 0;
  CARETAKER_ID: number = 0;
  CAST: any;
  OCCUPANCY_TYPE: any = 'P';
  STATUS: any = 'P';
  RESIDENCE_TYPE_ID: number = 0;
  APPLIED_RESIDENCE_TYPE_ID: any = [];
  // PHYSICAL_OCCUPANCY_LETTER
  // PHYSICAL_TAKEN_DATE_TIME
  // TECHNICAL_OCCUPANCY_LETTER
  // TECHNICAL_REMARK
  // TECHNICAL_TAKEN_DATE_TIME
  FLAT_ID: any;
  FLOOR_ID: any;
  ALLOTMENT_DATE_TIME: any;
  // ALLOTMENT_FINAL_LETTER
  // ALLOTMENT_FINAL_LETTER_DATE_TIME
  // AUTHORISATION_OCCUPATION_LETTER
  // AUTHORISATION_OCCUPATION_LETTER_DATE_TIME
  // INSPECTOR_FINAL_ACTION_DATE_TIME
  // INSPECTOR_ID: number;
  // MONTH
  // YEAR
  // SERVICE_TYPE
}
export class EmployeeQuarterFormsMaster1 {
  ID: any = 0;
  EMPLOYEE_NAME: any;
  EMPLOYEE_CODE: any;
  EMAIL_ID: any;
  CLIENT_ID: any = 1;
  MOBILE_NO: any;
  CIVIL_LIST: any;
  DESIGNATION_ID: any;
  JOINING_DATE: any;
  PRESENT_PAY_LEVEL_DATE: any;
  GRAD_PAY_LEVEL_ID: any;
  DATE_OF_PRIORITY: any;
  RETIREMENT_DATE: any;
  DOB: any;
  GENDER: any;
  CHECK_CONDITION: any;
  BASIC_PAY: any;
  BUILDING_ID: number = 0;
  CARETAKER_ID: number = 0;
  CAST: any;
  OCCUPANCY_TYPE: any;
  STATUS: any = 'P';
  RESIDENCE_TYPE_ID: number = 0;
  APPLIED_RESIDENCE_TYPE_ID: any = [];
  FLAT_ID: any;
  FLOOR_ID: any;
  ALLOTMENT_DATE_TIME: any;
}

export class EmpTransferData {
  ID: number = 0;
  EMPLOYEE_NAME: string = '';
  EMP_NO: number;
  EMP_ID: number;
  MOBILE_NO: number;
  DESIGNATION: any;
  RANK_ID1: any;
  REQ_BUILDING_ID: any | null;
  REQ_OFFICE_ID: any | null;
  REQ_BUILDING_ID_2: any | null;
  REQ_OFFICE_ID_2: any | null;
  REQ_BUILDING_ID_3: any | null;
  REQ_OFFICE_ID_3: any | null;
  // ON_WHICH_GROUND: any = "M";
  SUMMARY_OF_TRANSFER: any;
  FROM_DATE:any
  TO_DATE:any
  OTP: number;
  ATTACHMENTS: any;
  // SUBMITTED_THROUGH_PROPOSAL: boolean = true;
  REQ_STATUS: any = 'P';
  APPLICATION_NO: any;
  EMAIL_ID: any;
  REQ_BUILDING_ID_5: any;
  REQ_BUILDING_ID_4: any;
  REQ_OFFICE_ID_5: any;
  REQ_OFFICE_ID_4: any;
  CURRENT_OFFICE_ID: any;
  SPEND_DAY_IN_OFFICE: any;
  REASON_FOR_TRANSFER: any;
  ADDRESS: any;
  SHORT_NAME: any;
  OFFICE_CATEGORY: any;
  OFFICE_CATEGORY_2: any;
  OFFICE_CATEGORY_3: any;
  OFFICE_CATEGORY_4: any;
  OFFICE_CATEGORY_5: any;
  APAR_SUBMITTED: any = 1;
  IS_REGISTERED_ON_iGOT: any = 0;
  IS_UPDATED: boolean = false;
  // IPR_FILLING_DATE: any;
}

export class EmpTransferDataForEdit {
  ID: number = 0;
  EMPLOYEE_NAME: string = '';
  EMP_NO: number;
  EMP_ID: number;
  MOBILE_NO: number;
  DESIGNATION: any;
  REQ_BUILDING_ID: any | null;
  REQ_OFFICE_ID: any | null;
  REQ_BUILDING_ID_2: any | null;
  REQ_OFFICE_ID_2: any | null;
  REQ_BUILDING_ID_3: any | null;
  REQ_OFFICE_ID_3: any | null;
  // ON_WHICH_GROUND: any = "M";
  SUMMARY_OF_TRANSFER: any;
  OTP: number;
  ATTACHMENTS: any;
  // SUBMITTED_THROUGH_PROPOSAL: boolean = true;
  REQ_STATUS: any = 'P';
  APPLICATION_NO: any;
  EMAIL_ID: any;
  REQ_BUILDING_ID_5: any;
  REQ_BUILDING_ID_4: any;
  REQ_OFFICE_ID_5: any;
  REQ_OFFICE_ID_4: any;
  CURRENT_OFFICE_ID: any;
  SPEND_DAY_IN_OFFICE: any;
  REASON_FOR_TRANSFER: any;
  ADDRESS: any;
  SHORT_NAME: any;
  OFFICE_CATEGORY: any;
  OFFICE_CATEGORY_2: any;
  OFFICE_CATEGORY_3: any;
  OFFICE_CATEGORY_4: any;
  OFFICE_CATEGORY_5: any;
  APAR_SUBMITTED: any = 1;
  IS_REGISTERED_ON_iGOT: any = 0;
  HA_REQUEST: any;
  HA_DATE: any;
  HA_REMARK: any;
  HA_REQUEST_NAME: any;
  EMPLOYEE_CODE: any;
  CURRENT_OFFICE_NAME: any
  REQ_BUILDING_NAME_5: any;
  REQ_BUILDING_NAME_4: any;
  REQ_OFFICE_NAME_5: any;
  REQ_OFFICE_NAME_4: any;
  REQ_BUILDING_NAME_3: any;
  REQ_OFFICE_NAME_3: any;
  REQ_BUILDING_NAME_2: any;
  REQ_OFFICE_NAME_2: any;
  REQ_BUILDING_NAME: any;
  REQ_OFFICE_NAME: any;
  DESIGNATION_NAME: any;
}