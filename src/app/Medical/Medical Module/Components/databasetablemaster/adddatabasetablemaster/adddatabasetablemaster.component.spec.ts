import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddatabasetablemasterComponent } from './adddatabasetablemaster.component';

describe('AdddatabasetablemasterComponent', () => {
  let component: AdddatabasetablemasterComponent;
  let fixture: ComponentFixture<AdddatabasetablemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdddatabasetablemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdddatabasetablemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
