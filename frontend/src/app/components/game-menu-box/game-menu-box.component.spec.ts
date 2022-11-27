import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuBoxComponent } from './game-menu-box.component';

describe('GameMenuBoxComponent', () => {
  let component: GameMenuBoxComponent;
  let fixture: ComponentFixture<GameMenuBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameMenuBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameMenuBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
