export class profile {
  ID: any
  NAME: any
  EMPLOYEE_CODE: any
  GRADE_PAY: any
  OFFICE_NAME: any
  DESIGNATION_ID: any
  LOCATION: any
  DDO_OF_THE_OFFICIAL: any
  DDO_OF_THE_OFFICIAL_ID: any
  CREATED_MODIFIED_DATE: any
  READ_ONLY: any
  ARCHIVE_FLAG: any
  CLIENT_ID: any
  EMAIL_ID: any
  MOBILE_NO: any
  ADDRESS: any
  GRADE_PAY_LEVEL: any
  DOB: any
  PAN_CARD: any
  POSTED_CITY_ID: any
  JOINING_DATE: any
  RETIREMENT_DATE: any
  SERVICE_TYPE: any = null
  CAST: any = null
  CAST_CERTIFICATE: any;
  JOINING_LETTER: any
  MARRITAL_STATUS: any
  PROFILE_PHOTO: any;
  GENDER: any;
  AGE: any;
  GRADE_PAY_LEVEL_ID: any;
  RESIDENCE_TYPE_NAME1: any;
  GRASS_GRADE_PAY: any;
  GRAAS_GRADE_PAY_ID: any;
  IS_UPDATED:any

}


export class address {
  ID: number;
  CLIENT_ID: number = 1;
  EMPLOYEE_ID: any;
  PERMANENT_ADDRESS_LINE_1: any;
  PERMANENT_ADDRESS_LINE_2: any;
  PERMANENT_STATE_ID: any;
  PERMANENT_CITY_ID: number;
  PERMANENT_PINCODE: any;
  TEMP_ADDRESS_LINE_1: any;
  TEMP_ADDRESS_LINE_2: any;
  TEMP_STATE_ID: number;
  TEMP_CITY_ID: number;
  TEMP_PINCODE: any;
  IS_PERMANENT: boolean = false;
  OFFICE_ADDRESS_LINE_1: any;
  OFFICE_ADDRESS_LINE_2: any;
  STATE_ID: number;
  CITY_ID: number;
  OFFICE_PINCODE: any;
  CONTACT_NO_2: any
  CONTACT_NO_1: any
  DATACARD_INFO: any
  OFFICE_MAIL_ID: any
  MUMBAI_LOCAL_LINE: any;
  TEMP_MUMBAI_LOCAL_LINE: any;
  PERMANENT_MUMBAI_LOCAL_LINE: any;
  CITY_NAME: any;
  STATE_NAME: any;
  TEMP_CITY_NAME: any;
  TEMP_STATE_NAME: any;
  PERMANENT_CITY_NAME: any;
  PERMANENT_STATE_NAME: any;
  IS_UPDATED:any
  PERMANENT_AREA:any;
  TEMP_AREA:any;
  TEMP_ADDRESS_PROOF:any
  PRE_ADDRESS_PROOF:any


}


export class Personalinfo {
  ID: number;
  CLIENT_ID: number = 1;
  NAME: any;
  MOBILE_NO: any;
  EMAIL_ID: any;
  PROFILE_PHOTO: any;
  OFFICE_MOBILE_NO: any;
  OFFICE_MAIL_ID: any;
  GENDER: any;
  MARRITAL_STATUS: any;
  DOB: any;
  CATEGORY_ID: any;
  SUB_CATEGORY_ID: any;
  CATEGORY_NAME: any;
  SUB_CATEGORY_NAME: any;
  BLOOD_GROUP: any;
  PAN_CARD: any;
  AADHAR_NO: any;
  EMPLOYEE_CODE: any;
  IS_SPORTS_PERSON: any;
  IS_PERSONAL_FILLED: any;
  IS_ADDRESS_FILLED: any;
  IS_SERVICE_FILLED: any;
  IS_OPTIONAL_FILLED: any;
  IS_FAMILY_FILLED: any;
  MOTHER_TONGUE: String;
  ADDRESS: any;
  GPF_ACCOUNT_NO:any
PRAN_NO:any
CIVIL_CODE:any
CGHS_NO:any
DOMICILE_HOMETOWN:any
IS_UPDATED:any

  // RELIGION_ID: any;
  // DESIGNATION_ID: any;
  // DOMICILE_HOMETOWN: any;
  // PROBABLE_PLACE_AFTER_RETIRE: any;
  // PRAN_NO: any;
  // GPF_ACCOUNT_NO: any;
  // CIVIL_CODE: any;
  // CGHS_NO: any;
  // ROASTER_CATEGORY_ID: number
  // SSC_RANK: number;
  // SSC_PASSING_YEAR: any
  // SSC_PASSING_MONTH: any
  // SSC_PASSING_YEAR_MONTH: any;
  STATUS: any = 1;
  // RETIREMENT_DATE: any;
  // KNOWLEDGE_DETAILS: any;
  // IS_COMPUTER_KNOWLEDGE: any = 0;
  // IS_SPORTPERSON: any = 0;
}

export class services {
  ID: number;
  CLIENT_ID: number = 1;
  CLASS_ID: number
  DESIGNATION_ID: number
  RANK_ID: number | undefined
  EMPLOYEE_ID: number
  DOJ_PRESENT_POST: any
  ICARD_NO: any
  OFFICE_ID: number
  IS_SERVICE_FILLED: any = 1
  POSTING_PLACE: any
  DOJ_PRESENT_RANK: any
  RETIREMENT_DATE: any
  DOE_GOV_SERVICE: any
  RANK_ID_GOV_SERVICE: number
  DOJ_IT_IND: any
  RANK_ID_IT_IND_SERVICE: number
  DOJ_IT_STATE: any
  RANK_ID_IT_STATE_SERVICE: number
  // DOC_ASST2: any
  // DOC_ASST1: any
  // DOR_PRESENT_OFFICE: any
  // DOR_PRESENT_STATION: any
  POST_TYPE_ID: number;
  RANK_NAME: any;
  CLASS_NAME: any;
  OFFICE_NAME: any;
  RANK_ID_IT_IND_SERVICE_NAME: any;
  RANK_ID_GOV_SERVICE_NAME: any;
  RANK_ID_IT_STATE_SERVICE_NAME: any;
  IS_UPDATED:any

}

export class Family {
  ID: number;
  NAME: string;
  EMPLOYEE_ID: any;
  GENDER: any;
  RELATION: string;
  DOB: any;
  IS_FAMILY_FILLED: any = 1;
  IS_ADOPTED: boolean = false;
  EDUCATION: string;
  MARITAL_STATUS: string;
  IS_EMPLOYED: boolean = false;
  EMPLOYER_DETAILS: string;
  OCCUPATION: string;
  REMARK: string;
  SPOUSE_HOMETOWN: string;
  IS_SPOUSE_IN_IT: boolean = false;
  SPOUSE_CIVIL_CODE: string;
  IS_SPOUSE_TRANSFERABLE: any;
  CLIENT_ID: any;
  AGE: any;
  IS_DEPENDENT:boolean
  IS_UPDATED:any

  CGHS_CARD_NO:any
}

export class OtherInfoOptionalMaster {
  ID: number;
  CLIENT_ID: number;
  EMPLOYEE_ID: number;
  SPCL_INT_RELATED_TO_JOB: string;
  // MOTHER_TONGUE: string;
  KNOWN_LANGUAGES: any = [];
  KNOWN_LANGUAGES_2: string;
  KNOWN_LANGUAGES_3: string;
  KNOWN_LANGUAGES_4: string;
  REASON: string;
  IS_UPDATED:any

}


export class EMPEDUCATIONDETAILS {
  ID: number;
  EMPLOYEE_ID: any;
  EDUCATION_TYPE_ID: number;
  COURSE_DEGREE_NAME: string;
  COURSE_DEGREE_ID: string;
  COLLEGE_UNIVERSITY_NAME: string;
  MONTH_YEAR: any;
  MAIN_SUBJECT: string;
  IS_COMPUTER_KNOWLEDGE: boolean = false;
  KNOWLEDGE_DETAILS: string;
  CLIENT_ID: any;
  MARKS: number;
  IS_HIGHEST: boolean = false;
  IS_UPDATED:any
}



export class ExamMaster {
  EMPLOYEE_ID: number;
  ID: number;
  EXAM_ID: number;
  PASSING_DATE: string | null;
  IS_CONCESSION: boolean = false;
  IS_GRACEMARKS: boolean = false;
}