import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLevelUpgradeFormComponent } from './pay-level-upgrade-form.component';

describe('PayLevelUpgradeFormComponent', () => {
  let component: PayLevelUpgradeFormComponent;
  let fixture: ComponentFixture<PayLevelUpgradeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayLevelUpgradeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLevelUpgradeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
