import { Test, TestingModule } from '@nestjs/testing';
import { DbTokensService } from './db-tokens.service';

describe('DbTokensService', () => {
  let service: DbTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbTokensService],
    }).compile();

    service = module.get<DbTokensService>(DbTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
