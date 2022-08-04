import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchiffComponent } from './schiff.component';

describe('SchiffComponent', () => {
  let component: SchiffComponent;
  let fixture: ComponentFixture<SchiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchiffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
