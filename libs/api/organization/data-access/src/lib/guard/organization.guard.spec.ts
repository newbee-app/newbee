import { createMock } from '@golevelup/ts-jest';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { testOrganizationEntity1 } from '@newbee/api/shared/data-access';
import { organizationSlugNotSpecifiedBadRequest } from '@newbee/shared/util';
import { OrganizationService } from '../organization.service';
import { OrganizationGuard } from './organization.guard';

describe('OrganizationGuard', () => {
  let guard: OrganizationGuard;
  let organizationService: OrganizationService;
  let context: ExecutionContext;

  beforeEach(() => {
    organizationService = createMock<OrganizationService>({
      findOneBySlug: jest.fn().mockResolvedValue(testOrganizationEntity1),
    });
    guard = new OrganizationGuard(organizationService);
    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue(
        createMock<HttpArgumentsHost>({
          getRequest: jest.fn().mockReturnValue({
            params: { org: testOrganizationEntity1.slug },
          }),
        })
      ),
    });
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(context).toBeDefined();
  });

  describe('no org slug', () => {
    it('should throw a BadRequestException', async () => {
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {} });
      await expect(guard.canActivate(context)).rejects.toThrow(
        new BadRequestException(organizationSlugNotSpecifiedBadRequest)
      );
    });
  });

  describe('valid org slug', () => {
    it('should return true and add the organization to the request', async () => {
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest().org).toEqual(
        testOrganizationEntity1
      );
    });
  });
});
