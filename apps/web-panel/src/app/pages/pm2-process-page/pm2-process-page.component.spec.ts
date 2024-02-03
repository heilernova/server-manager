import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pm2ProcessPageComponent } from './pm2-process-page.component';

describe('Pm2ProcessPageComponent', () => {
  let component: Pm2ProcessPageComponent;
  let fixture: ComponentFixture<Pm2ProcessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pm2ProcessPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Pm2ProcessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
