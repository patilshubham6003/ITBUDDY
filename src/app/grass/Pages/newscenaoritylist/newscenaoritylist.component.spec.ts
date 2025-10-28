import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewscenaoritylistComponent } from './newscenaoritylist.component';

describe('NewscenaoritylistComponent', () => {
  let component: NewscenaoritylistComponent;
  let fixture: ComponentFixture<NewscenaoritylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewscenaoritylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewscenaoritylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
