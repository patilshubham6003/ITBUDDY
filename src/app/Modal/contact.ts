export class Contact {
    ID: number;
    CLIENT_ID: number = 1;
    LONGITUDE  :string='';   
    LATITUDE:string='';   
    ADDRESS:string='';
    EMAIL_ID:string='';
    CONTACT_NO:number=0;
    FACEBOOK_LINK:string='';
    TWITTER_LINK:string='';
    INSTA_LINK:string='';
    STATUS:boolean=true;
}
export class feedback {
    ID: number;
    CLIENT_ID: number = 1;
        EMPLOYEE_ID:any;
        DESCRIPTION:any=''
        ATTACHMENT:any;
        FEEDBACK_STATUS:any='P'
        REMARK:any;
        STATUS:any=true
        TYPE:any='';
        SUBJECT:any=''
        CREATED_DATE:any=new Date();
}

