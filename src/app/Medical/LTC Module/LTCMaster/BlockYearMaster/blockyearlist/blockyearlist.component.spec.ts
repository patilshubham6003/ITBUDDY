import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockyearlistComponent } from './blockyearlist.component';

describe('BlockyearlistComponent', () => {
  let component: BlockyearlistComponent;
  let fixture: ComponentFixture<BlockyearlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockyearlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockyearlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
