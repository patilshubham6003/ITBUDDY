import { Time } from "@angular/common";

export class taskSubtaskMaster{
    CLIENT_ID: number;
    ID: number;
    TASK_CATEGORY_ID: number;
    FEATURE_ID: number;
    PARENT_ID: number= 0;
    NAME: string;
    DESCRIPTION: string;
    ESTIMATED_HOURS: number;
    ESTIMATED_MINUTES: number;
    ESTIMATED_SECONDS: number;
    ASSIGNEE_ID: number;
    REPORTER_ID: number;
    PRIORITY: string;
    TIME_TRACKED: any;
    STATUS: string= "TD";
    START_DATE: any;
    END_DATE: any;
    IS_CHILD: boolean= false;
    DEPENDENT_TASK_ID: number= 0;
    UPDATED_DATETIME: any;
    TAGS: string;
    PROGRESS: number;
    IS_ACTIVE: boolean;
    ASSIGNEES: number[];
    TYPE: number;
}