import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchFrameComponent } from './watchFrame.component';

describe('WatchFrameComponent', () => {
  let component: WatchFrameComponent;
  let fixture: ComponentFixture<WatchFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
