import { Test, TestingModule } from '@nestjs/testing';
import { UserOrganizationService } from './user-organization.service';

describe('UserOrganizationService', () => {
  let service: UserOrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOrganizationService],
    }).compile();

    service = module.get<UserOrganizationService>(UserOrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
