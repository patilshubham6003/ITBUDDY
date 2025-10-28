import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatavailableaddComponent } from './flatavailableadd.component';

describe('FlatavailableaddComponent', () => {
  let component: FlatavailableaddComponent;
  let fixture: ComponentFixture<FlatavailableaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatavailableaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatavailableaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
