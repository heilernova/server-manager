import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { appEditPageResolver } from './app-edit-page.resolver';
import { Application } from '@app/common/api/apps';

describe('appEditPageResolver', () => {
  const executeResolver: ResolveFn<Application> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => appEditPageResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
