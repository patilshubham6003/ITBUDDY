import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowflatpreftoempComponent } from './showflatpreftoemp.component';

describe('ShowflatpreftoempComponent', () => {
  let component: ShowflatpreftoempComponent;
  let fixture: ComponentFixture<ShowflatpreftoempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowflatpreftoempComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowflatpreftoempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
