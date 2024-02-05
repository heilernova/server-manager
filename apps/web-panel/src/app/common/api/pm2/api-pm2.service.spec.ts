import { TestBed } from '@angular/core/testing';

import { ApiPm2Service } from './api-pm2.service';

describe('ApiPm2Service', () => {
  let service: ApiPm2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPm2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
