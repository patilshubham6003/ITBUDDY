import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjuriaadeshdrawerComponent } from './manjuriaadeshdrawer.component';

describe('ManjuriaadeshdrawerComponent', () => {
  let component: ManjuriaadeshdrawerComponent;
  let fixture: ComponentFixture<ManjuriaadeshdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManjuriaadeshdrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManjuriaadeshdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
