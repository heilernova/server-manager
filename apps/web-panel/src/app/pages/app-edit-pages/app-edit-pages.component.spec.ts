import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEditPagesComponent } from './app-edit-pages.component';

describe('AppEditPagesComponent', () => {
  let component: AppEditPagesComponent;
  let fixture: ComponentFixture<AppEditPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppEditPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppEditPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
