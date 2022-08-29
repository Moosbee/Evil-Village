import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationArmyComponent } from './animation-army.component';

describe('AnimationArmyComponent', () => {
  let component: AnimationArmyComponent;
  let fixture: ComponentFixture<AnimationArmyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimationArmyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationArmyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
