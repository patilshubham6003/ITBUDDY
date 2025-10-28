import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationComponentComponent } from './investigation-component.component';

describe('InvestigationComponentComponent', () => {
  let component: InvestigationComponentComponent;
  let fixture: ComponentFixture<InvestigationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
