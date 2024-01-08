import { Test, TestingModule } from '@nestjs/testing';
import { DbUsersService } from './db-users.service';

describe('DbUsersService', () => {
  let service: DbUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbUsersService],
    }).compile();

    service = module.get<DbUsersService>(DbUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
