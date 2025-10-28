import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrenderRequestsListComponent } from './surrender-requests-list.component';

describe('SurrenderRequestsListComponent', () => {
  let component: SurrenderRequestsListComponent;
  let fixture: ComponentFixture<SurrenderRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurrenderRequestsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurrenderRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
