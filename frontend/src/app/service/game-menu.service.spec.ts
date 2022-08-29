import { TestBed } from '@angular/core/testing';

import { GameMenuService } from './game-menu.service';

describe('GameMenuService', () => {
  let service: GameMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
