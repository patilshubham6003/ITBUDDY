import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjuriaadeshltsDrwaerComponent } from './manjuriaadeshlts-drwaer.component';

describe('ManjuriaadeshltsDrwaerComponent', () => {
  let component: ManjuriaadeshltsDrwaerComponent;
  let fixture: ComponentFixture<ManjuriaadeshltsDrwaerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManjuriaadeshltsDrwaerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManjuriaadeshltsDrwaerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
