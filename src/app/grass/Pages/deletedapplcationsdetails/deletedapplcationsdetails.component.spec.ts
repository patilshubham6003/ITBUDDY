import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedapplcationsdetailsComponent } from './deletedapplcationsdetails.component';

describe('DeletedapplcationsdetailsComponent', () => {
  let component: DeletedapplcationsdetailsComponent;
  let fixture: ComponentFixture<DeletedapplcationsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedapplcationsdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedapplcationsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
