import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Contact } from 'src/app/Modal/contact';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: Contact = new Contact();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}

  //Google map
  latitude: number = 0;
  longitude: number = 0;
  zoom = 12;
  // @Input() center: google.maps.LatLngLiteral={ lat: 16.867634, lng: 74.570389 };
  // markerOptions: google.maps.MarkerOptions = { draggable: true };
  // @Input() markerPositions: google.maps.LatLngLiteral ={ lat: 16.867634, lng: 74.570389 };

  // addMarker2(event: any) {
  //   this.markerPositions = event.latLng.toJSON();
  //   this.latitude = this.markerPositions.lat;
  //   this.longitude = this.markerPositions.lng;

  //   this.data.LATITUDE = this.latitude.toString();
  //   this.data.LONGITUDE   = this.longitude.toString();
  // }

  // googleMapPointer() {
  //   this.center = {
  //     lat: Number(this.data.LATITUDE),
  //     lng: Number(this.data.LONGITUDE  ),
  //   }
  //   this.markerPositions = { lat: Number(this.data.LATITUDE), lng: Number(this.data.LONGITUDE  ) };
  // }
  //////

  ngOnInit(): void {}

  close(): void {
    this.drawerClose();
  }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ////

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new Contact();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.EMAIL_ID.trim() == '' &&
      this.data.CONTACT_NO != undefined &&
      this.data.LONGITUDE.trim() == '' &&
      this.data.LATITUDE.trim() == '' &&
      this.data.ADDRESS.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    } else if (this.data.EMAIL_ID == null || this.data.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (this.data.CONTACT_NO == undefined || this.data.CONTACT_NO <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Contact Number', '');
    }
    // else
    // if(!this.mobpattern.test(this.data.CONTACT_NO.toString())){
    //   this.message.error('Please Enter Valid Contact Number ','')
    // }
    else if (this.data.LONGITUDE == null || this.data.LONGITUDE.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Longitude', '');
    } else if (this.data.LATITUDE == null || this.data.LATITUDE.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Latitude', '');
    } else if (this.data.ADDRESS == null || this.data.ADDRESS.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Address', '');
    }
    if (this.isOk) {
      this.isSpinning = false;
      // this.data.LATITUDE = this.latitude.toString();
      // this.data.LONGITUDE   = this.longitude.toString();
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateContact(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createContact(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new Contact();
              this.resetDrawer(websitebannerPage);
              // this.data.img= '';
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  open(link: any) {
    if (link != null || link != undefined) {
      window.open(link);
    }
  }
}
