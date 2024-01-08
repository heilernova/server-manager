import { Test, TestingModule } from '@nestjs/testing';
import { DbAppsService } from './db-apps.service';

describe('DbAppsService', () => {
  let service: DbAppsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbAppsService],
    }).compile();

    service = module.get<DbAppsService>(DbAppsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
