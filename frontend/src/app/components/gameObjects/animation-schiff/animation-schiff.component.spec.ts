import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationSchiffComponent } from './animation-schiff.component';

describe('AnimationSchiffComponent', () => {
  let component: AnimationSchiffComponent;
  let fixture: ComponentFixture<AnimationSchiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimationSchiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimationSchiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
