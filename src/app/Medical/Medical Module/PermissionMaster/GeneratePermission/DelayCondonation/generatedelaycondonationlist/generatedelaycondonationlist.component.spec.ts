import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedelaycondonationlistComponent } from './generatedelaycondonationlist.component';

describe('GeneratedelaycondonationlistComponent', () => {
  let component: GeneratedelaycondonationlistComponent;
  let fixture: ComponentFixture<GeneratedelaycondonationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedelaycondonationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedelaycondonationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
