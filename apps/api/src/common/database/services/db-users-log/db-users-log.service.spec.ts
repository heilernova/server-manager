import { Test, TestingModule } from '@nestjs/testing';
import { DbUsersLogService } from './db-users-log.service';

describe('DbUsersLogService', () => {
  let service: DbUsersLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbUsersLogService],
    }).compile();

    service = module.get<DbUsersLogService>(DbUsersLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
