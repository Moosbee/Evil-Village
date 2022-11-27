import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsetComponent } from './unset.component';

describe('UnsetComponent', () => {
  let component: UnsetComponent;
  let fixture: ComponentFixture<UnsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnsetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
