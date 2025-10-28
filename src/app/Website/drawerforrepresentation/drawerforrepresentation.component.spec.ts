import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerforrepresentationComponent } from './drawerforrepresentation.component';

describe('DrawerforrepresentationComponent', () => {
  let component: DrawerforrepresentationComponent;
  let fixture: ComponentFixture<DrawerforrepresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerforrepresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerforrepresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
