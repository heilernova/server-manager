import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListPagesComponent } from './app-list-pages.component';

describe('AppListPagesComponent', () => {
  let component: AppListPagesComponent;
  let fixture: ComponentFixture<AppListPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppListPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppListPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
