import { Test, TestingModule } from '@nestjs/testing';
import { GoogleaiController } from './googleai.controller';

describe('GoogleaiController', () => {
  let controller: GoogleaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleaiController],
    }).compile();

    controller = module.get<GoogleaiController>(GoogleaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
