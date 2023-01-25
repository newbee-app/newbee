import { Test, TestingModule } from '@nestjs/testing';
import { UserOrganizationController } from './user-organization.controller';

describe('UserOrganizationController', () => {
  let controller: UserOrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOrganizationController],
    }).compile();

    controller = module.get<UserOrganizationController>(
      UserOrganizationController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
