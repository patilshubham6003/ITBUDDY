import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatpreferenceaaddComponent } from './flatpreferenceaadd.component';

describe('FlatpreferenceaaddComponent', () => {
  let component: FlatpreferenceaaddComponent;
  let fixture: ComponentFixture<FlatpreferenceaaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatpreferenceaaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatpreferenceaaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
