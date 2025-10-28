import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationdetailedreportComponent } from './applicationdetailedreport.component';

describe('ApplicationdetailedreportComponent', () => {
  let component: ApplicationdetailedreportComponent;
  let fixture: ComponentFixture<ApplicationdetailedreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationdetailedreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationdetailedreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
