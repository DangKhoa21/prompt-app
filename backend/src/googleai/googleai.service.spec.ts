import { Test, TestingModule } from '@nestjs/testing';
import { GoogleaiService } from './googleai.service';

describe('GoogleaiService', () => {
  let service: GoogleaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleaiService],
    }).compile();

    service = module.get<GoogleaiService>(GoogleaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
