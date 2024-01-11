import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLoginSessionComponent } from './form-login-session.component';

describe('FormLoginSessionComponent', () => {
  let component: FormLoginSessionComponent;
  let fixture: ComponentFixture<FormLoginSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLoginSessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormLoginSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
