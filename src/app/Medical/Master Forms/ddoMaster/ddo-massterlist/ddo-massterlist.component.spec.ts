import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdoMassterlistComponent } from './ddo-massterlist.component';

describe('DdoMassterlistComponent', () => {
  let component: DdoMassterlistComponent;
  let fixture: ComponentFixture<DdoMassterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdoMassterlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DdoMassterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
