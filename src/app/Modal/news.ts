export class News {
    ID: number;
    CLIENT_ID: number = 1;
    NAME: string='';
    IMG_URL: string='';
    DATE:any;
    NEWS_CONTENT_TYPE:string='P';
    SERVICE_ID:number=0;
    TITLE: string='';
    NEWS_URL:string='';
    SHOW_IN_SERVICE: boolean=false;
    SEQUENCE_NO: number;
    IS_LATEST:number=0;
    STATUS: boolean=true;
}