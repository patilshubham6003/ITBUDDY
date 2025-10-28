import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrassSignatureMasterListComponent } from './grass-signature-master-list.component';

describe('GrassSignatureMasterListComponent', () => {
  let component: GrassSignatureMasterListComponent;
  let fixture: ComponentFixture<GrassSignatureMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrassSignatureMasterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrassSignatureMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
