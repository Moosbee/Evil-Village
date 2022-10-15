import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuObjectComponent } from './game-menu-object.component';

describe('GameMenuObjectComponent', () => {
  let component: GameMenuObjectComponent;
  let fixture: ComponentFixture<GameMenuObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameMenuObjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameMenuObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
