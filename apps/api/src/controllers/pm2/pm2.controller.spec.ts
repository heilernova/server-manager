import { Test, TestingModule } from '@nestjs/testing';
import { Pm2Controller } from './pm2.controller';

describe('Pm2Controller', () => {
  let controller: Pm2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Pm2Controller],
    }).compile();

    controller = module.get<Pm2Controller>(Pm2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
