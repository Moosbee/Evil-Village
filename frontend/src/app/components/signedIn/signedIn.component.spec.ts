import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedInComponent } from './signedIn.component';

describe('SignedInComponent', () => {
  let component: SignedInComponent;
  let fixture: ComponentFixture<SignedInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignedInComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
