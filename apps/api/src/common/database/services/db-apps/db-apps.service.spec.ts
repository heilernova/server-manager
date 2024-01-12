import { Test, TestingModule } from '@nestjs/testing';
import { DbApplicationsService } from './db-apps.service';

describe('DbAppsService', () => {
  let service: DbApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbApplicationsService],
    }).compile();

    service = module.get<DbApplicationsService>(DbApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
