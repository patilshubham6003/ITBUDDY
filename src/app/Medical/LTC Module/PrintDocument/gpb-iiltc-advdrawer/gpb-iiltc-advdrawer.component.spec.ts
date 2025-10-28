import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpbIIltcAdvdrawerComponent } from './gpb-iiltc-advdrawer.component';

describe('GpbIIltcAdvdrawerComponent', () => {
  let component: GpbIIltcAdvdrawerComponent;
  let fixture: ComponentFixture<GpbIIltcAdvdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpbIIltcAdvdrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpbIIltcAdvdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
