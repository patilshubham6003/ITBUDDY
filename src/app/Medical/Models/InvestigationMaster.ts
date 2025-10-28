export class InvestigationMaster {
  ID: number;
  CLAIM_ID: number;
  TYPE: any = 'I';
  CLAIMED_AMOUNT: number;
  CODE_NO: string = '';
  PARTICULARS: any;
  ADMISSIBLE_AMOUNT: any;
  INVESTIGATION_PROCEDURE_ID: number;
  SHORT_CODE = '';
  FINALE_AMOUNT: number = 0;
  RATE: number;
  QTY: number;
  RATE_LIST = '';
  CHANGE = 0;
  IS_PACKAGE = false;
  STATUS = 1;
  CLAIM_HOSPITAL_MAPPING_ID: number;
  DESCRIPTION: any = '';
  IS_DISCOUNT_APPLIED: boolean = false;
  SEQ_NO: number = 0;
  IS_ADVANCE:any;
}
