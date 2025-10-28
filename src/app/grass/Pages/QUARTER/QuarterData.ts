export class QuarterMaster {
    ID: number = 0;
    NAME: string = '';
    RESIDENCE_TYPE_ID: any;
    AVAILABLE_STATUS: any;
    TEMP_STATUS: any;
    ROOM_TYPE: any;
    CITY_ID: any;
    AREA_ID: any;
    BLOCK_ID: any;
    FLOOR_ID: any;
    SEQUENCE_NO: any;
    BUILDING_ID: any
    STATUS: boolean = true;
    CATEGORY: any;
    IS_PUBLISHED: any = 0;
    RESERVED_FOR:any= 'A';
    REMARK: any;
    REMARK_FILE: any;
}

export class payLevelUpgrade {
    ID: number = 0;
    CLIENT_ID: any = 1;
    EMP_ID: any;
    RESIDENCE_TYPE_ID: any;
    OLD_DESIGNATION_ID: any;
    NEW_DESIGNATION_ID: any;
    OLD_GRADE_PAY_LEVEL_ID: any;
    NEW_GRADE_PAY_LEVEL_ID: any;
    OLD_PRESENT_PAY_LEVEL_DATE: any;
    NEW_PRESENT_PAY_LEVEL_DATE: any;
    USER_ID: any;

}