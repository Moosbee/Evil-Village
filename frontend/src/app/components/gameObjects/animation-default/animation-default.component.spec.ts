import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationDefaultComponent } from './animation-default.component';

describe('AnimationDefaultComponent', () => {
  let component: AnimationDefaultComponent;
  let fixture: ComponentFixture<AnimationDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimationDefaultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimationDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
