import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationchargesofpersonaleffectsComponent } from './transportationchargesofpersonaleffects.component';

describe('TransportationchargesofpersonaleffectsComponent', () => {
  let component: TransportationchargesofpersonaleffectsComponent;
  let fixture: ComponentFixture<TransportationchargesofpersonaleffectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportationchargesofpersonaleffectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationchargesofpersonaleffectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
