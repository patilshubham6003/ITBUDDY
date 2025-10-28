import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpremployeelistComponent } from './ipremployeelist.component';

describe('IpremployeelistComponent', () => {
  let component: IpremployeelistComponent;
  let fixture: ComponentFixture<IpremployeelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpremployeelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpremployeelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
