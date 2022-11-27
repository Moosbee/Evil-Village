import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigMapComponent } from './config-map.component';

describe('ConfigMapComponent', () => {
  let component: ConfigMapComponent;
  let fixture: ComponentFixture<ConfigMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
