export class Deatailsandpurposeoftours {
  ID: number = 0;
  DEPARTURE_DATETIME: any;
  DEPARTURE_FROM: any;
  ARRIVAL_DATETIME: any;
  ARRIVAL_TO: any;
  TRAVEL_MODE_ID: any;
  TRAVEL_CLASS_ID: any;
  FARE_PAID: any=0;
  DISTANCE_IN_KM_FOR_ROAD: any = 0;

  PURPOSE_OF_JOURNEY: any = '';
  DAYS_OF_HALT: any;
  HOURS_OF_HALT: any = 0;
  TRAVEL_MODE_NAME: any;
  TRAVEL_CLASS_NAME: any;
  IS_RETURNED: boolean = false;
  TICKET_FROM: boolean = false;
  RELAXATION_PROVIDED: boolean = false;
  TOUR_ID: any;
  EMP_ID: any;
  RATE_PER_KM: any = 0;
  CLAIMED_FARE_PAID: any=0;
  TOUR_AIR_TICKET: any;
  TOUR_BOARDING_PASS: any;
  TOUR_ROAD_TICKETS: any;
  TOUR_IRCTC_ROAD_TICKETS: any;
  TOUR_BOATSHIP_TICKET: any;
}
