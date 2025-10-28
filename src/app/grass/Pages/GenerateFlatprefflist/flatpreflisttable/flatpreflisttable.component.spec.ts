import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatpreflisttableComponent } from './flatpreflisttable.component';

describe('FlatpreflisttableComponent', () => {
  let component: FlatpreflisttableComponent;
  let fixture: ComponentFixture<FlatpreflisttableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatpreflisttableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatpreflisttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
