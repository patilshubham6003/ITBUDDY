import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAreaMappingComponent } from './user-area-mapping.component';

describe('UserAreaMappingComponent', () => {
  let component: UserAreaMappingComponent;
  let fixture: ComponentFixture<UserAreaMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAreaMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAreaMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
