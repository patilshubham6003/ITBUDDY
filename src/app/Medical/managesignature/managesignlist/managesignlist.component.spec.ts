import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagesignlistComponent } from './managesignlist.component';

describe('ManagesignlistComponent', () => {
  let component: ManagesignlistComponent;
  let fixture: ComponentFixture<ManagesignlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagesignlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagesignlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
