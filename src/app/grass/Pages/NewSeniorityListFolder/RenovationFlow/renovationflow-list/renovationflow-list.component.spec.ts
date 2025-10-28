import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationflowListComponent } from './renovationflow-list.component';

describe('RenovationflowListComponent', () => {
  let component: RenovationflowListComponent;
  let fixture: ComponentFixture<RenovationflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovationflowListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovationflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
