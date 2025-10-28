import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateflatpreflistComponent } from './generateflatpreflist.component';

describe('GenerateflatpreflistComponent', () => {
  let component: GenerateflatpreflistComponent;
  let fixture: ComponentFixture<GenerateflatpreflistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateflatpreflistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateflatpreflistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
