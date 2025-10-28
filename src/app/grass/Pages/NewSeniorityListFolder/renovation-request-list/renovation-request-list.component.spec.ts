import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationRequestListComponent } from './renovation-request-list.component';

describe('RenovationRequestListComponent', () => {
  let component: RenovationRequestListComponent;
  let fixture: ComponentFixture<RenovationRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovationRequestListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovationRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
