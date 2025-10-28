import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateseniorityaddComponent } from './generateseniorityadd.component';

describe('GenerateseniorityaddComponent', () => {
  let component: GenerateseniorityaddComponent;
  let fixture: ComponentFixture<GenerateseniorityaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateseniorityaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateseniorityaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
