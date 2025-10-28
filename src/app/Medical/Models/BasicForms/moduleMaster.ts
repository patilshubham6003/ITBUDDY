export class moduleMaster{
    CLIENT_ID: number;
    ID: number;
    PROJECT_ID: number;
    NAME: string;
    DESCRIPTION: string;
    ESTIMATED_MANDAYS: number;
    START_DATE: any;
    END_DATE: any;
    ATTACHMENT_1: string;
    ATTACHMENT_2: string;
    ATTACHMENT_3: string;
    STATUS: string= "P";
    ESTIMATED_HOURS: number;
    ESTIMATED_MINUTES: number;
    ESTIMATED_SECONDS: number;
    SERIAL_NO: any;
    IS_ACTIVE: boolean;
    ASSIGNEES: number[];
    REPORTER_ID: number;
    TYPE: number;
}