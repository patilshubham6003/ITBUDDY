import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesnewComponent } from './preferencesnew.component';

describe('PreferencesnewComponent', () => {
  let component: PreferencesnewComponent;
  let fixture: ComponentFixture<PreferencesnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferencesnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreferencesnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
