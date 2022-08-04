import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadtComponent } from './stadt.component';

describe('StadtComponent', () => {
  let component: StadtComponent;
  let fixture: ComponentFixture<StadtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StadtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
