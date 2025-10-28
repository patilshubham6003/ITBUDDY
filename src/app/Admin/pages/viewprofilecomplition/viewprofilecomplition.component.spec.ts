import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprofilecomplitionComponent } from './viewprofilecomplition.component';

describe('ViewprofilecomplitionComponent', () => {
  let component: ViewprofilecomplitionComponent;
  let fixture: ComponentFixture<ViewprofilecomplitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewprofilecomplitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewprofilecomplitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
