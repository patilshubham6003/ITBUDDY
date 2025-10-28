import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationdrawerComponent } from './applicationdrawer.component';

describe('ApplicationdrawerComponent', () => {
  let component: ApplicationdrawerComponent;
  let fixture: ComponentFixture<ApplicationdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationdrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
