import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingDrawerComponent } from './building-drawer.component';

describe('BuildingDrawerComponent', () => {
  let component: BuildingDrawerComponent;
  let fixture: ComponentFixture<BuildingDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
