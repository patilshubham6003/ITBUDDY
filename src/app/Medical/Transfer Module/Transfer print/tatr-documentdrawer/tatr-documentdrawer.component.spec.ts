import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TATRDocumentdrawerComponent } from './tatr-documentdrawer.component';

describe('TATRDocumentdrawerComponent', () => {
  let component: TATRDocumentdrawerComponent;
  let fixture: ComponentFixture<TATRDocumentdrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TATRDocumentdrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TATRDocumentdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
