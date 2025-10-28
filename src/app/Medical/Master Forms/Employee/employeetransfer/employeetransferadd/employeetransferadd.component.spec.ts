import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetransferaddComponent } from './employeetransferadd.component';

describe('EmployeetransferaddComponent', () => {
  let component: EmployeetransferaddComponent;
  let fixture: ComponentFixture<EmployeetransferaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeetransferaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeetransferaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
