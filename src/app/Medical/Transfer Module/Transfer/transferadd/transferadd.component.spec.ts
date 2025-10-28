import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferaddComponent } from './transferadd.component';

describe('TransferaddComponent', () => {
  let component: TransferaddComponent;
  let fixture: ComponentFixture<TransferaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
