import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatavailablelistComponent } from './flatavailablelist.component';

describe('FlatavailablelistComponent', () => {
  let component: FlatavailablelistComponent;
  let fixture: ComponentFixture<FlatavailablelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatavailablelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatavailablelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
