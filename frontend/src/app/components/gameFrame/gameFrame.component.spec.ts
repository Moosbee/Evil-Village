import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFrameComponent } from './gameFrame.component';

describe('GameFrameComponent', () => {
  let component: GameFrameComponent;
  let fixture: ComponentFixture<GameFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
