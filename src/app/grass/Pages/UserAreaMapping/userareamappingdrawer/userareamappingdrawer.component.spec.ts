import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserareamappingdrawerComponent } from './userareamappingdrawer.component';

describe('UserareamappingdrawerComponent', () => {
  let component: UserareamappingdrawerComponent;
  let fixture: ComponentFixture<UserareamappingdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserareamappingdrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserareamappingdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
