import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmyComponent } from './army.component';

describe('ArmyComponent', () => {
  let component: ArmyComponent;
  let fixture: ComponentFixture<ArmyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
