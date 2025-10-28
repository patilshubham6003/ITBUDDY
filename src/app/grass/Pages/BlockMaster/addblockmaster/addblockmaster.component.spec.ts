import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddblockmasterComponent } from './addblockmaster.component';

describe('AddblockmasterComponent', () => {
  let component: AddblockmasterComponent;
  let fixture: ComponentFixture<AddblockmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddblockmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddblockmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
