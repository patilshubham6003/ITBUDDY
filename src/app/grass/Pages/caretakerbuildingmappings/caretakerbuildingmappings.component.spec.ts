import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretakerbuildingmappingsComponent } from './caretakerbuildingmappings.component';

describe('CaretakerbuildingmappingsComponent', () => {
  let component: CaretakerbuildingmappingsComponent;
  let fixture: ComponentFixture<CaretakerbuildingmappingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretakerbuildingmappingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretakerbuildingmappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
