import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddddoMassterComponent } from './addddo-masster.component';

describe('AddddoMassterComponent', () => {
  let component: AddddoMassterComponent;
  let fixture: ComponentFixture<AddddoMassterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddddoMassterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddddoMassterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
