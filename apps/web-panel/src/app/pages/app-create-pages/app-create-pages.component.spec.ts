import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCreatePagesComponent } from './app-create-pages.component';

describe('AppCreatePagesComponent', () => {
  let component: AppCreatePagesComponent;
  let fixture: ComponentFixture<AppCreatePagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCreatePagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppCreatePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
