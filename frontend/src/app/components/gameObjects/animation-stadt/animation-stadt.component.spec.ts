import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationStadtComponent } from './animation-stadt.component';

describe('AnimationStadtComponent', () => {
  let component: AnimationStadtComponent;
  let fixture: ComponentFixture<AnimationStadtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationStadtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationStadtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
