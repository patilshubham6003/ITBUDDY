import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsignaturemasterComponent } from './addsignaturemaster.component';

describe('AddsignaturemasterComponent', () => {
  let component: AddsignaturemasterComponent;
  let fixture: ComponentFixture<AddsignaturemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsignaturemasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddsignaturemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
