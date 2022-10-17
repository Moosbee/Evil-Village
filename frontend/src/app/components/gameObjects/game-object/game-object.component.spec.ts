import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameObjectComponent } from './game-object.component';

describe('GameObjectComponent', () => {
  let component: GameObjectComponent;
  let fixture: ComponentFixture<GameObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameObjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
