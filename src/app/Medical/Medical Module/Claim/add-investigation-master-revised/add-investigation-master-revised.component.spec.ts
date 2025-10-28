import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestigationMasterRevisedComponent } from './add-investigation-master-revised.component';

describe('AddInvestigationMasterRevisedComponent', () => {
  let component: AddInvestigationMasterRevisedComponent;
  let fixture: ComponentFixture<AddInvestigationMasterRevisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvestigationMasterRevisedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvestigationMasterRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
