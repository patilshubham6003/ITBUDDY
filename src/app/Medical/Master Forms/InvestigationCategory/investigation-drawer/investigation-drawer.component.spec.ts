import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationDrawerComponent } from './investigation-drawer.component';

describe('InvestigationDrawerComponent', () => {
  let component: InvestigationDrawerComponent;
  let fixture: ComponentFixture<InvestigationDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
