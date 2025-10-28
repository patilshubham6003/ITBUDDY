import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrendercaretakerformComponent } from './surrendercaretakerform.component';

describe('SurrendercaretakerformComponent', () => {
  let component: SurrendercaretakerformComponent;
  let fixture: ComponentFixture<SurrendercaretakerformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurrendercaretakerformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurrendercaretakerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
