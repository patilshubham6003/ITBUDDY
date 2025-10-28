import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllemployeereportComponent } from './allemployeereport.component';

describe('AllemployeereportComponent', () => {
  let component: AllemployeereportComponent;
  let fixture: ComponentFixture<AllemployeereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllemployeereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllemployeereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
