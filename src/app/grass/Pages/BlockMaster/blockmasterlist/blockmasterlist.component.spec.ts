import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockmasterlistComponent } from './blockmasterlist.component';

describe('BlockmasterlistComponent', () => {
  let component: BlockmasterlistComponent;
  let fixture: ComponentFixture<BlockmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockmasterlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
