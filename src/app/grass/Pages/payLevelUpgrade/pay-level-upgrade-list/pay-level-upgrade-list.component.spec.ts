import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLevelUpgradeListComponent } from './pay-level-upgrade-list.component';

describe('PayLevelUpgradeListComponent', () => {
  let component: PayLevelUpgradeListComponent;
  let fixture: ComponentFixture<PayLevelUpgradeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayLevelUpgradeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLevelUpgradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
