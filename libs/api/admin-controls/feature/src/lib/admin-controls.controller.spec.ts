import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminControlsService } from '@newbee/api/admin-controls/data-access';
import { SearchService } from '@newbee/api/search/data-access';
import {
  EntityService,
  testAdminControlsEntity1,
  testUserEntity1,
  testUserEntity2,
  testWaitlistMemberEntity1,
} from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { WaitlistMemberService } from '@newbee/api/waitlist-member/data-access';
import {
  AdminControlsRelationAndUsersDto,
  UserRoleEnum,
  testAdminControlsRelation1,
  testAdminControlsRelationAndUsersDto1,
  testAppSearchDto1,
  testAppSearchResultsDto1,
  testAppSuggestDto1,
  testEmailDto1,
  testOffsetAndLimit1,
  testSuggestResultsDto1,
  testUpdateAdminControlsDto1,
} from '@newbee/shared/util';
import { AdminControlsController } from './admin-controls.controller';

jest.mock('@newbee/shared/util', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/shared/util'),
  AdminControlsRelationAndUsersDto: jest.fn(),
}));
const mockAdminControlsRelationAndUsersDto =
  AdminControlsRelationAndUsersDto as jest.Mock;

describe('AdminControlsController', () => {
  let controller: AdminControlsController;
  let service: AdminControlsService;
  let entityService: EntityService;
  let searchService: SearchService;
  let userService: UserService;
  let waitlistMemberService: WaitlistMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminControlsController],
      providers: [
        {
          provide: AdminControlsService,
          useValue: createMock<AdminControlsService>({
            update: jest.fn().mockResolvedValue(testAdminControlsEntity1),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            getAdminControlsRelation: jest
              .fn()
              .mockResolvedValue(testAdminControlsRelation1),
          }),
        },
        {
          provide: SearchService,
          useValue: createMock<SearchService>({
            appSuggest: jest.fn().mockResolvedValue(testSuggestResultsDto1),
            appSearch: jest.fn().mockResolvedValue(testAppSearchResultsDto1),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            getAllAndCount: jest
              .fn()
              .mockResolvedValue([[testUserEntity1, testUserEntity2], 2]),
            findOneByEmail: jest.fn().mockResolvedValue(testUserEntity1),
            update: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: WaitlistMemberService,
          useValue: createMock<WaitlistMemberService>({
            getAllAndCount: jest
              .fn()
              .mockResolvedValue([[testWaitlistMemberEntity1], 1]),
          }),
        },
      ],
    }).compile();

    controller = module.get(AdminControlsController);
    service = module.get(AdminControlsService);
    entityService = module.get(EntityService);
    searchService = module.get(SearchService);
    userService = module.get(UserService);
    waitlistMemberService = module.get(WaitlistMemberService);

    jest.clearAllMocks();
    mockAdminControlsRelationAndUsersDto.mockReturnValue(
      testAdminControlsRelationAndUsersDto1,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
    expect(searchService).toBeDefined();
    expect(userService).toBeDefined();
    expect(waitlistMemberService).toBeDefined();
  });

  describe('get', () => {
    it('should get admin controls', async () => {
      await expect(controller.get(testUserEntity1)).resolves.toEqual(
        testAdminControlsRelationAndUsersDto1,
      );
      expect(entityService.getAdminControlsRelation).toHaveBeenCalledTimes(1);
      expect(userService.getAllAndCount).toHaveBeenCalledTimes(1);
      expect(userService.getAllAndCount).toHaveBeenCalledWith(
        testOffsetAndLimit1,
      );
      expect(mockAdminControlsRelationAndUsersDto).toHaveBeenCalledTimes(1);
      expect(mockAdminControlsRelationAndUsersDto).toHaveBeenCalledWith(
        testAdminControlsRelation1,
        {
          ...testOffsetAndLimit1,
          results: [testUserEntity1, testUserEntity2],
          total: 2,
        },
      );
    });
  });

  describe('update', () => {
    it('should update admin controls', async () => {
      await expect(
        controller.update(testUpdateAdminControlsDto1, testUserEntity1),
      ).resolves.toEqual(testAdminControlsEntity1);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(testUpdateAdminControlsDto1);
    });
  });

  describe('makeUserAdmin', () => {
    it('should make user admin', async () => {
      await expect(controller.makeUserAdmin(testEmailDto1)).resolves.toEqual(
        testUserEntity1,
      );
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        testEmailDto1.email,
      );
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(testUserEntity1, {
        role: UserRoleEnum.Admin,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should get user results', async () => {
      await expect(
        controller.getAllUsers(testOffsetAndLimit1),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        results: [testUserEntity1, testUserEntity2],
        total: 2,
      });
      expect(userService.getAllAndCount).toHaveBeenCalledTimes(1);
      expect(userService.getAllAndCount).toHaveBeenCalledWith(
        testOffsetAndLimit1,
      );
    });
  });

  describe('getAllWaitlistMembers', () => {
    it('should get waitlist member results', async () => {
      await expect(
        controller.getAllWaitlistMembers(testOffsetAndLimit1),
      ).resolves.toEqual({
        ...testOffsetAndLimit1,
        results: [testWaitlistMemberEntity1],
        total: 1,
      });
      expect(waitlistMemberService.getAllAndCount).toHaveBeenCalledTimes(1);
      expect(waitlistMemberService.getAllAndCount).toHaveBeenCalledWith(
        testOffsetAndLimit1,
      );
    });
  });

  describe('suggest', () => {
    it('should return suggest results', async () => {
      await expect(controller.suggest(testAppSuggestDto1)).resolves.toEqual(
        testSuggestResultsDto1,
      );
      expect(searchService.appSuggest).toHaveBeenCalledTimes(1);
      expect(searchService.appSuggest).toHaveBeenCalledWith(testAppSuggestDto1);
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      await expect(controller.search(testAppSearchDto1)).resolves.toEqual(
        testAppSearchResultsDto1,
      );
      expect(searchService.appSearch).toHaveBeenCalledTimes(1);
      expect(searchService.appSearch).toHaveBeenCalledWith(testAppSearchDto1);
    });
  });
});
