import { Test, TestingModule } from '@nestjs/testing';
import { DocService } from './doc.service';

describe('DocService', () => {
  let service: DocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocService],
    }).compile();

    service = module.get<DocService>(DocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
