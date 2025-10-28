import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceddrawerComponent } from './advanceddrawer.component';

describe('AdvanceddrawerComponent', () => {
  let component: AdvanceddrawerComponent;
  let fixture: ComponentFixture<AdvanceddrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceddrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceddrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
