import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassSignatureMasterDrawerComponent } from './grass-signature-master-drawer.component';

describe('GrassSignatureMasterDrawerComponent', () => {
  let component: GrassSignatureMasterDrawerComponent;
  let fixture: ComponentFixture<GrassSignatureMasterDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrassSignatureMasterDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrassSignatureMasterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
