import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovationListComponent } from './renovation-list.component';

describe('RenovationListComponent', () => {
  let component: RenovationListComponent;
  let fixture: ComponentFixture<RenovationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
