import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubevideoslinksComponent } from './youtubevideoslinks.component';

describe('YoutubevideoslinksComponent', () => {
  let component: YoutubevideoslinksComponent;
  let fixture: ComponentFixture<YoutubevideoslinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubevideoslinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubevideoslinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
