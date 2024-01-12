import { TestBed } from '@angular/core/testing';

import { ApiAppsService } from './api-apps.service';

describe('ApiAppsService', () => {
  let service: ApiAppsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAppsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
